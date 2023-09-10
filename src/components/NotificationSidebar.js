import React, { useState } from "react";
import '../styles/NotificationSidebar.css';

const NotificationSidebar = ({ isOpen, onClose }) => {
//   const [notifications, setNotifications] = useState([]);


  return (
    <div className={`notification-sidebar ${isOpen ? "open" : ""}`}>
      <button onClick={onClose}>Close</button>
      <h3>Notifications</h3>
      <div className="notification-content">
        {/* <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul> */}
         <p>hello</p>
      </div>
    </div>
  );
};

export default NotificationSidebar;
