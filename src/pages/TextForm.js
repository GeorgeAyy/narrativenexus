import React, { useState } from "react";
import { FiCheckCircle, FiEdit } from "react-icons/fi";

const TextForm = ({ onProcessText }) => {
  const [text, setText] = useState("");
  const [action, setAction] = useState("summarize");
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a state variable

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const toggleAction = () => {
    setAction(action === "summarize" ? "paraphrase" : "summarize");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Disable the button when clicked
    console.log("disabled")
    await onProcessText(text, action);
    setIsSubmitting(false); // Enable the button after execution
    console.log("abled")
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
      <button onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : <> <FiCheckCircle /> <span>Submit</span></>}

      </button>
    </div>
  );
};

export default TextForm;
