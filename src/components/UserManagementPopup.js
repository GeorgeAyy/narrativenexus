import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import config from '../config.json';
const UserManagementPopup = ({ documentId, closeUserManagementPopup }) => {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [invitationMessage, setInvitationMessage] = useState('');

  // Fetch users from the backend when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://${config.ip}:5000/invites/${documentId}/users`);
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
          documentId,
          username: newUsername,
        }),
      });

      if (response.ok) {
        setInvitationMessage('Invitation sent successfully.');
      } else {
        console.error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  return (
    <div className="user-management-popup">
      <h2>User Management</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span className="username">{user.username}</span>
            <button className="delete-button" onClick={() => deleteUser(user.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="invite-section">
        <input
          type="text"
          placeholder="Enter email to invite"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
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
