import React, { useState, useEffect } from "react";
import TextForm from "./TextForm";
import Output from "../components/Output";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/sumandpar.css";
export default function SumAndPar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleToggleClick = () => {
    setMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(true);
    }
  };

  useEffect(() => {
    const handleLinkClick = (event, sectionId) => {
      event.preventDefault();
      scrollToSection(sectionId);
    };

    const links = [
      { selector: ".item a[href='#section3']", id: "section3" },
      { selector: ".item a[href='#section2']", id: "section2" },
      { selector: ".logo a[href='#section1']", id: "section1" },
    ];

    links.forEach(({ selector, id }) => {
      const link = document.querySelector(selector);
      if (link) {
        link.addEventListener("click", (event) => handleLinkClick(event, id));

        return () => {
          link.removeEventListener("click", (event) =>
            handleLinkClick(event, id)
          );
        };
      }
    });
  }, []);
  const [outputText, setOutputText] = useState("");

  const processText = async (text, action) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/process_text", {
        text,
        action,
      });
      setOutputText(response.data);
    } catch (error) {
      setOutputText(`Error processing text: ${error}`);
    }
  };

  return (
    <div className="app">
      <Navbar
        isMenuOpen={isMenuOpen}
        handleToggleClick={handleToggleClick}
        scrollToSection={scrollToSection}
      />
      <TextForm onProcessText={processText} />
      <Output outputText={outputText} />
    </div>
  );
}
