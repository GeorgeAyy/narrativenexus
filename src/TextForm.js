import React, { useState } from "react";
import { FiCheckCircle, FiEdit } from "react-icons/fi";

const TextForm = ({ onProcessText }) => {
  const [text, setText] = useState("");
  const [action, setAction] = useState("summarize");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const toggleAction = () => {
    setAction(action === "summarize" ? "paraphrase" : "summarize");
  };

  const handleSubmit = () => {
    onProcessText(text, action);
  };

  return (
    <div className="text-form">
      <h1>Summarizer and Paraphraser tool</h1>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Enter your text here..."
      />
      <div className="toggle-button" onClick={toggleAction}>
        <span className={`action ${action}`}>{action}</span>
        <div className="icon">
          {action === "summarize" ? <FiCheckCircle /> : <FiEdit />}
        </div>
      </div>
      <button onClick={handleSubmit}>
        <FiCheckCircle />
        Submit
      </button>
    </div>
  );
};

export default TextForm;
