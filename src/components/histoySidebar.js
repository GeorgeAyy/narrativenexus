import React, { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;


const HistorySidebar = ({ documents, isOpen, toggleSidebar }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [localDocuments, setLocalDocuments] = useState(documents);

    useEffect(() => {
      setLocalDocuments(documents);
    }, [documents]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const documentsToDisplay = localDocuments.slice(startIndex, endIndex);

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
  const handleEdit = (documentId) => {
    // Implement your edit logic here
    console.log(`Editing document with ID: ${documentId}`);

  };

  const handleDelete = (documentId) => {
    fetch('http://localhost:5000/history/deleteDocument', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId: documentId }),
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Document with ID ${documentId} has been deleted`);
          // Remove the deleted document from local state
          const updatedDocuments = localDocuments.filter(
            (document) => document._id !== documentId
          );
          setLocalDocuments(updatedDocuments);
        }
      })
      .catch((error) => console.error('Error fetching documents:', error));
  };

  function stripHtmlTags(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
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
  <a href={`/documents/${document._id}`} className="history-anchor" key={document.data}>
    <li className="history-item">
      <span>{document.data ? stripHtmlTags(document.data) : "Empty"}</span>
      <span className="history-icons">
        <FontAwesomeIcon
          icon={faEdit}
          className="edit-icon"
          onClick={(e) => {
            e.preventDefault(); // Prevent the default link navigation
            handleEdit(document._id);
          }}
        />
        <FontAwesomeIcon
          icon={faTrash}
          className="delete-icon"
          onClick={(e) => {
            e.preventDefault(); // Prevent the default link navigation
            handleDelete(document._id);
          }}
        />
      </span>
    </li>
  </a>
))}

      </ul>
      {renderPaginationButtons()}
    </div>
  );
};

export default HistorySidebar;