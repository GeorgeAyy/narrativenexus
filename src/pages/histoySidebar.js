import React from 'react';

const HistorySidebar = ({ history, isOpen, toggleSidebar }) => {
  return (
    <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
      <h2 className="history-heading">Previous History</h2>
      <ul className="history-list">
        {history.map((item, index) => (
          <li key={index} className="history-item">
            {item}
          </li>
        ))}
        {/* Add dummy history items */}
        <li className="history-item"> <a href="#dummy-history-item-1">Dummy History Item 1</a></li>
        <li className="history-item"> <a href="#dummy-history-item-2">Dummy History Item 2</a></li>
        <li className="history-item"> <a href="#dummy-history-item-3">Dummy History Item 3</a></li>
      </ul>
    </div>
  );
};

export default HistorySidebar;
