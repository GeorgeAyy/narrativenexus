// InvalidAccessPage.js
import React from 'react';
import '../styles/invalidaccess.css';
const InvalidAccessPage = () => {
  return (
    <div className="invalidcontainer">
      <div className="invalid-access">
        <h1>Invalid Access</h1>
        <p>You do not have permission to access this page.</p>
        <button onClick={() => window.location.href = '/'}>Back to Home</button>
      </div>
    </div>
  );
}

export default InvalidAccessPage;
