import React from 'react';

const HistorySidebar = ({ documents, isOpen, toggleSidebar }) => {
  return (
    <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
      <h2 className="history-heading">Previous History</h2>
      <ul className="history-list">
        {documents.map((document) => (
          <li key={document._id} className="history-item">
            {document._id}
          </li>
        ))}
        
      </ul>
    </div>
  );
};

export default HistorySidebar;
