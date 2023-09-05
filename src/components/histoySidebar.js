import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;


const HistorySidebar = ({ documents, isOpen, toggleSidebar }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const documentsToDisplay = documents.slice(startIndex, endIndex);

  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPaginationButtons = () => {
    const isPreviousDisabled = currentPage === 1;
    const isNextDisabled = currentPage === totalPages;

    return (
      <div className="pagination">
        {!isPreviousDisabled && (
          <button onClick={prevPage}>Previous</button>
        )}
        <span>Page {currentPage} of {totalPages}</span>
        {!isNextDisabled && (
          <button onClick={nextPage}>Next</button>
        )}
      </div>
    );
  };

  return (
    
    <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
      <h2 className="history-heading">Previous History</h2>
      <ul className="history-list">
        {documentsToDisplay.map((document) => (
          <a href={`/documents/${document._id}`} class="history-anchor">
          <li key={document.data} className="history-item">
            {document.data}
          </li>
          </a>
        ))}
      </ul>
      {renderPaginationButtons()}
    </div>
  );
};

export default HistorySidebar;
