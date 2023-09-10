// Navbar.js
import React, { useEffect } from "react";
import {useLocation} from 'react-router-dom';
import { useCookies,removeCookie } from "react-cookie";
import image from "../images/logo.png";
import NotificationSidebar from "./NotificationSidebar";
import { useState } from "react";
import config from "../config.json";
const Navbar = ({ isMenuOpen, handleToggleClick, scrollToSection }) => {
  const getItemClassName = () => {
    return isMenuOpen ? "active" : "";
  };
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [showNotifications, setShowNotifications] = useState(false); // Add state to manage notification sidebar visibility
  const [notification, setNotification] = useState([]); // Add state to manage notifications
  const handleLogoutClick = (e) => {
    e.preventDefault();
    removeCookie('user', { path: '/' });
    window.location.href = '/';
  };
  const toggleNotifications = () => {
    console.log("Toggling notifications");
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    if (cookies.user) {
      // Load notifications only if 'cookies.user' is truthy
      const loadNotifications = async () => {
        try {
          const response = await fetch(
            `http://${config.ip}:5000/invites/getNotifications`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: cookies.user._id }),
            }
          );
          const data = await response.json();
          setNotification(data.receivedInvitations);
          console.log(data);
        } catch (error) {
          console.log(`Error loading notifications: ${error}`);
        }
      };
      loadNotifications();
    }
  }, []); // Include 'cookies.user' as a dependency

  if(location.pathname ==='/')
  {
    return(
      <nav>
      <ul className="menu">
        <li className="logo">
          <a onClick={() => scrollToSection("section1")} href="#section1">
            <img src = {image} alt ="logo" className = "logoinnav"/>
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
        <li className={`item`}>
            <button onClick={toggleNotifications}>Notifications</button>
          </li>
      </ul>
      <NotificationSidebar
        isOpen={showNotifications}
        onClose={toggleNotifications}
        notifications={notification}
      />
    </nav>
    )
  }
  else{
    return(
      <nav>
      <ul className="menu">
        <li className="logo">
          <a href="/">
          <img src = {image} alt ="logo" className = "logoinnav"/>
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
