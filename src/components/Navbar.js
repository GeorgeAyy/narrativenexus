// Navbar.js
import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useCookies } from "react-cookie";
import image from "../images/logo.png";
import NotificationSidebar from "./NotificationSidebar";
import { useState } from "react";
import config from "../config.json";
const Navbar = ({ isMenuOpen, handleToggleClick, scrollToSection }) => {
  const getItemClassName = () => {
    return isMenuOpen ? "active" : "";
  };
  const location = useLocation();
  const [cookies, removeCookie] = useCookies(['user']);
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
          console.log("Notifications loaded: " + data.receivedInvitations)
          setNotification(data.receivedInvitations);
          console.log(data);
        } catch (error) {
          console.log(`Error loading notifications: ${error}`);
        }
      };
      loadNotifications();
    }
  }, []); // Include 'cookies.user' as a dependency
  // YourComponent.js

  // Function to accept an invitation
  const acceptInvitation = async (ownerId, documentId, inviteeEmail) => {
    try {
      const response = await fetch(
        `http://${config.ip}:5000/invites/acceptInvitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ownerId, documentId, inviteeEmail }),
        }
      );

      if (response.ok) {
        // Invitation accepted successfully, update the UI as needed
        // For example, remove the notification from the list
        const updatedNotifications = notification.filter((notification) => {
          return (
            notification.inviterId !== ownerId ||
            notification.documentId !== documentId
          );
        });

        setNotification(updatedNotifications);
      } else {
        // Handle the case where accepting the invitation was not successful
        console.error("Failed to accept invitation");
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  // Function to decline an invitation
  const declineInvitation = async (ownerId, documentId, inviteeEmail) => {
    try {
      const response = await fetch(
        `http://${config.ip}:5000/invites/declineInvitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ownerId, documentId, inviteeEmail }),
        }
      );

      if (response.ok) {
        // Invitation declined successfully, update the UI as needed
        // For example, remove the notification from the list
        const updatedNotifications = notification.filter((notification) => {
          return (
            notification.inviterId !== ownerId ||
            notification.documentId !== documentId
          );
        });

        setNotification(updatedNotifications);
      } else {
        // Handle the case where declining the invitation was not successful
        console.error("Failed to decline invitation");
      }
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };


  if (location.pathname === '/') {
    return (
      <nav>
        <ul className="menu">
          <li className="logo">
            <a onClick={() => scrollToSection("section1")} href="#section1">
              <img src={image} alt="logo" className="logoinnav" />
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
              <NotificationSidebar
                isOpen={showNotifications}
                onClose={toggleNotifications}
                notifications={notification}
                sendInvitation={acceptInvitation}
                declineInvitation={declineInvitation}
                email={cookies.user.email}
              />
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
            <button class="NotificationBtn" onClick={toggleNotifications}>Notifications</button>
          </li>
        </ul>




      </nav>
    )
  }
  else {
    return (
      <nav>
        <ul className="menu">
          <li className="logo">
            <a href="/">
              <img src={image} alt="logo" className="logoinnav" />
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
