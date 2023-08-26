import React, { useState } from 'react';
import '../styles/promptgenerator.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const genres = ['Fantasy', 'Romance', 'Mystery', 'Science Fiction', 'Historical Fiction'];
const characterTypes = ['Hero', 'Villain', 'Detective', 'Alien'];


const generatePrompt = async (text) => {

    try {
        const response = await fetch("http://127.0.0.1:8000/api/generate_prompt/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text,

            }),
        });
        const data = await response.json();
        setOutputText(data);
    } catch (error) {
        setOutputText(`Error processing text: ${error}`);
    }
    finally {
        document.getElementById("prompt").value = outputText;
    }
};




const PromptGenerator = () => {
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedCharacterType, setSelectedCharacterType] = useState('');
    const [prompt, setPrompt] = useState('');
    const [outputText, setOutputText] = useState("");


    // const generatePrompt = () => {
    //     // Generate a prompt based on selectedGenre and selectedCharacterType
    //     const newPrompt = `Write a ${selectedGenre} story featuring a ${selectedCharacterType}.`;
    //     setPrompt(newPrompt);
    // };

    return (
        <div className="prompt-generator">
            <h1>Writing Prompt Generator</h1>
            <div className="options">
                <label>Select Genre:</label>
                <select onChange={(e) => setSelectedGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    {genres.map((genre, index) => (
                        <option key={index} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
                <label>Select Character Type:</label>
                <select onChange={(e) => setSelectedCharacterType(e.target.value)}>
                    <option value="">Select Character Type</option>
                    {characterTypes.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <button onClick={generatePrompt}>Generate Prompt</button>
            </div>
            <div className="generated-prompt">
                <h2>Your Writing Prompt:</h2>
                <p>{prompt}</p>
                {/* Text field where the generated prompt will appear */}
                <textarea
                    rows="4"
                    cols="50"
                    value={prompt}
                    readOnly
                    placeholder="Generated Prompt"
                    id='prompt'
                />
            </div>
        </div>
    );
};

export default PromptGenerator;