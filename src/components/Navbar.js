// Navbar.js
import React from "react";

const Navbar = ({ isMenuOpen, handleToggleClick, scrollToSection }) => {
  const getItemClassName = () => {
    return isMenuOpen ? "active" : "";
  };

  return (
    <nav>
      <ul className="menu">
        <li className="logo">
          <a onClick={() => scrollToSection("section1")} href="#section1">
            NN
          </a>
        </li>
        <li className={`item ${getItemClassName()}`}>
          <a onClick={() => scrollToSection("section2")} href="#section2">
            Summarizer and Paraphraser
          </a>
        </li>
        <li className={`item ${getItemClassName()}`}>
          <a onClick={() => scrollToSection("section3")} href="#section3">
            Writing Assistant
          </a>
        </li>
        <li className={`item button ${getItemClassName()}`}>
          <a href="login">Log In</a>
        </li>
        <li className={`item button secondary ${getItemClassName()}`} onClick={handleToggleClick}>
          <a href="signup">Sign Up</a>
        </li>
        <li className={`toggle ${getItemClassName()}`} onClick={handleToggleClick}>
          <span className="bars"></span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
