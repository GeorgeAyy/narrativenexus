import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import config from "../config.json";
import { useCookies, removeCookie } from "react-cookie";
const ITEMS_PER_PAGE = 10;

const HistorySidebar = ({ documents, isOpen, toggleSidebar, owner }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [localDocuments, setLocalDocuments] = useState(documents);
  const [editData, setEditData] = useState("");
  const [editedDocumentId, setEditedDocumentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Add state to track editing mode

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

  const saveEditedDataToServer = (documentId, updatedName) => {
    fetch(`http://${config.ip}:5000/history/saveEditedData`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentId: documentId, editedData: updatedName }), // Send the updated name to the server
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Document with ID ${documentId} has been updated`);
          // Update the local state with the edited data (optional)
          const updatedDocuments = localDocuments.map((document) => {
            if (document._id === documentId) {
              return { ...document, name: updatedName }; // Update the name in the local state
            }
            return document;
          });
          setLocalDocuments(updatedDocuments);
          setEditedDocumentId(null); // Exit edit mode
        } else {
          console.error(`Error updating document with ID ${documentId}`);
        }
      })
      .catch((error) => console.error("Error updating document:", error));
  };

  const handleDelete = (documentId) => {
    fetch(`http://${config.ip}:5000/history/deleteDocument`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
      .catch((error) => console.error("Error fetching documents:", error));
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
        {!isPreviousDisabled && <button onClick={prevPage}>Previous</button>}
        <span>
          Page {currentPage} of {totalPages}
        </span>
        {!isNextDisabled && <button onClick={nextPage}>Next</button>}
      </div>
    );
  };

  return (
    <div className={`history-sidebar ${isOpen ? "open" : ""}`}>
      <h2 className="history-heading">Previous History</h2>
      <ul className="history-list">
        {documentsToDisplay.map((document) => (
          <a
            href={`/documents/${document._id}`}
            className="history-anchor"
            key={document.data}
          >
            <li className="history-item">
              {isEditing && editedDocumentId === document._id ? (
                // Display an input field for editing
                <div>
                  <input
                    type="text"
                    value={editData}
                    onChange={(e) => setEditData(e.target.value)} // Update the edited data
                    autoFocus // Automatically focus the input field
                  />
                  <button
                    className="save-button"
                    onClick={(e) => {
                      e.preventDefault();
                      saveEditedDataToServer(document._id, editData); // Save the edited data to the server
                      setIsEditing(false); // Exit edit mode
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                // Display the document content
                <span>
                  {document.name
                    ? document.name
                    : document.data
                    ? stripHtmlTags(document.data)
                        .split(" ")
                        .slice(0, 5)
                        .join(" ")
                    : "Empty"}
                </span>
              )}
              {document.owner === cookies.user._id && (
                <span className="history-icons">
                  {!isEditing && (
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="edit-icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditing(true); // Enter edit mode
                        setEditedDocumentId(document._id);
                        setEditData(document.name || ""); // Initialize editData with the current name or an empty string
                      }}
                    />
                  )}
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="delete-icon"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(document._id);
                    }}
                  />
                </span>
              )}
            </li>
          </a>
        ))}
      </ul>
      {renderPaginationButtons()}
    </div>
  );
};

export default HistorySidebar;
