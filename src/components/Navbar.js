// Navbar.js
import React from "react";
import {useLocation} from 'react-router-dom';
import { useCookies,removeCookie } from "react-cookie";
const Navbar = ({ isMenuOpen, handleToggleClick, scrollToSection }) => {
  const getItemClassName = () => {
    return isMenuOpen ? "active" : "";
  };
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const handleLogoutClick = (e) => {
    e.preventDefault();
    removeCookie('user', { path: '/' });
    window.location.href = '/';
  };
  

  if(location.pathname ==='/')
  {
    return(
      <nav>
      <ul className="menu">
        <li className="logo">
          <a onClick={() => scrollToSection("section1")} href="#section1">
            NN
          </a>
        </li>
        {cookies.user && (
  <>
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
  </>
)}
        {cookies.user ? (
          <>
            <li className={`item button ${getItemClassName()}`}>
              <a onClick={handleLogoutClick}>Log Out</a>
            </li>
          </>
        ) : (
          <>
        <li className={`item button ${getItemClassName()}`}>
          <a href="login">Log In</a>
        </li>
        <li className={`item button secondary ${getItemClassName()}`} onClick={handleToggleClick}>
          <a href="signup">Sign Up</a>
        </li>
        </>
        )}
        <li className={`toggle ${getItemClassName()}`} onClick={handleToggleClick}>
          <span className="bars"></span>
        </li>
      </ul>
    </nav>
    )
  }
  else{
    return(
      <nav>
      <ul className="menu">
        <li className="logo">
          <a href="/">
            NN
          </a>
        </li>
        <li className={`item ${getItemClassName()}`}>
          <a href="/sumandpar">
            Summarizer and Paraphraser
          </a>
        </li>
        <li className={`item ${getItemClassName()}`}>
          <a href="/documents">
            Writing Assistant
          </a>
        </li>
        {cookies.user ? (
          <>
            <li className={`item button ${getItemClassName()}`}>
              <a onClick={handleLogoutClick}>Log Out</a>
            </li>
          </>
        ) : (
          <>
        <li className={`item button ${getItemClassName()}`}>
          <a href="login">Log In</a>
        </li>
        <li className={`item button secondary ${getItemClassName()}`} onClick={handleToggleClick}>
          <a href="signup">Sign Up</a>
        </li>
        </>
        )}
        <li className={`toggle ${getItemClassName()}`} onClick={handleToggleClick}>
          <span className="bars"></span>
        </li>
      </ul>
    </nav>
    )

  }
  
};
export default Navbar;
