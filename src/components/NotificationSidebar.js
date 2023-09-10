import React from "react";
import '../styles/NotificationSidebar.css';

const NotificationSidebar = ({ isOpen, onClose, notifications, sendInvitation, declineInvitation, email }) => {
  // ...

  const handleAcceptClick = (invitation) => {
    // Call the sendInvitation function with the necessary parameters
    const { ownerId, documentId, inviteeEmail } = invitation;
    sendInvitation(ownerId, documentId, inviteeEmail);
  };

  const handleDeclineClick = (invitation) => {
    // Call the declineInvitation function with the necessary parameters
    const { ownerId, documentId, inviteeEmail } = invitation;
    declineInvitation(ownerId, documentId, inviteeEmail);
  };

  return (
    <div className={`notification-sidebar ${isOpen ? "open" : ""}`}>
      <button onClick={onClose}>Close</button>
      <h3>Notifications</h3>
      <div className="notification-content">
        <ul className="notification-list">
          {notifications && notifications.map((notification) => (
            <li key={notification._id} className="notification-item">
              <span className="notification-text">
                {notification.inviterId} has invited you to edit document {notification.documentId}
              </span>
              <div className="notification-buttons">
                <button className="notification-button" onClick={() => handleAcceptClick({documentId: notification.documentId,  ownerId: notification.inviterId, inviteeEmail: email})}>Accept</button>
                <button className="notification-button" onClick={() => handleDeclineClick(notification)}>Decline</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationSidebar;
