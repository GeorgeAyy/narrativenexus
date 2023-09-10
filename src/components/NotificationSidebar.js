import React, { useState } from "react";
import '../styles/NotificationSidebar.css';

const NotificationSidebar = ({ isOpen, onClose,notifications }) => {
//   const [notifications, setNotifications] = useState([]);


  return (
    <div className={`notification-sidebar ${isOpen ? "open" : ""}`}>
      <button onClick={onClose}>Close</button>
      <h3>Notifications</h3>
      <div className="notification-content">
        <ul className="notification-list">
          {notifications && notifications.map((notifications) => (
            <li key={notifications._id} className="notification-item">
              <span className="notification-text">
                {notifications.inviterId} has invited you to edit document {notifications.documentId}
              </span>
              <div className="notification-buttons">
                <button className="notification-button">Accept</button>
                <button className="notification-button">Decline</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationSidebar;
