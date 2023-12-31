import React, { useState, useEffect } from "react";
import "../styles/promptgenerator.css";

import Navbar from "../components/Navbar";
import InvalidAccessPage from "../components/invalidaccesspage";
import { useCookies } from "react-cookie";
import config from "../config.json";
const genres = [
  "Fantasy",
  "Romance",
  "Mystery",
  "Science Fiction",
  "Historical Fiction",
];
const characterTypes = ["Hero", "Villain", "Detective", "Alien", "Princess"];

const PromptGenerator = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);


  const [outputText, setOutputText] = useState("");


  useEffect(() => {
    const generateButton = document.getElementById("generateButton");
    if (generateButton) {
      generateButton.addEventListener("click", generatePrompt);
    }
    return () => {
      if (generateButton) {
        generateButton.removeEventListener("click", generatePrompt);
      }
    };
  }, []);

  const generatePrompt = async () => {
    const genre = document.getElementById("genre").value;
    const character = document.getElementById("character").value;
    const promptText = `Write a ${genre} story featuring a ${character}`;
    console.log(promptText);
    try {
      const response = await fetch(
        `http://${config.ip}:3002/api/generate_prompt/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            promptText,
          }),
        }
      );
      const data = await response.json();
      setOutputText(data);
    } catch (error) {
      setOutputText(`Error processing text: ${error}`);
    }
  };
  if (!cookies.user) {
    return (
      <div className="divcontainer">
        <Navbar />
        <InvalidAccessPage />
      </div>
    );
  } else {
    return (
      <div className="divcontainer">
        <Navbar />

        <div className="">
          <h1>Writing Prompt Generator</h1>
          <div className="options">
            <label>Select Genre:</label>
            <select
              id="genre"

            >
              <option></option>
              {genres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <label>Select Character Type:</label>
            <select
              id="character"

            >
              <option></option>
              {characterTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button id="generateButton">Generate Prompt</button>
          </div>
          <div className="generated-prompt">
            <h2>Your Writing Prompt:</h2>

            {/* Text field where the generated prompt will appear */}
            <textarea
              rows="4"
              cols="50"
              value={outputText}
              readOnly
              placeholder="Generated Prompt"
              id="prompt"
            />
          </div>
        </div>
      </div>
    );
  }
};

export default PromptGenerator;
