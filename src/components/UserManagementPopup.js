import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import config from '../config.json';
import { useCookies, removeCookie } from "react-cookie";

const UserManagementPopup = ({ ownerId, documentId, closeUserManagementPopup,giveControl,snatchControl }) => {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [invitationMessage, setInvitationMessage] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  // Fetch users from the backend when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://${config.ip}:5000/invites/fetchUsers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ documentId }), // Include documentId in the request body
            });
            
            
        if (response.ok) {
          const data = await response.json();
          setUsers(data.collaborators); // Assuming the collaborators data is returned from the API
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, [documentId]);
  


  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://${config.ip}:5000/invites/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId, userId }), // Include documentId and userId in the request body
      });
  
      if (response.ok) {
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        setInvitationMessage('User deleted successfully.');
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  

  const inviteUserByEmail = async () => {
    try {
      const response = await fetch(`http://${config.ip}:5000/invites/sendInvitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: ownerId,
          documentId,
          inviteeEmail: document.getElementsByClassName('inviteeEmail')[0].value,
        }),
      });

      if (response.ok) {
        setInvitationMessage('Invitation sent successfully.');
      } else {
        setInvitationMessage('User Already Invited');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  return (
    <div className="user-management-popup">
      <h2>User Management</h2>
      <ul>
        
        {console.log("Users are:" + users)}

        {users.map((user) => (
          <li key={user._id}>
            <span className="username">{user.name}</span>
            <button className="delete-button" onClick={() => deleteUser(user.id)}>
              Remove
            </button>
            <button className="give-control-button" onClick={() => giveControl(user.id)}>
              Give Control
            </button>
            
          </li>
          
        ))}
        <button className="snatch-control-button" onClick={() => snatchControl()}>
              Snatch Control
            </button>
      </ul>
      <div className="invite-section">
        <input
          type="text"
          placeholder="Enter email to invite"
          className="inviteeEmail"
        />
        <button className="custombtn" onClick={inviteUserByEmail}>
          Invite
        </button>
      </div>
      <div className="message">{invitationMessage}</div>
      <button className="delete-button" onClick={closeUserManagementPopup}>
        Close
      </button>
    </div>
  );
};

export default UserManagementPopup;
