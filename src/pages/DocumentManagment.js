import React, { useState, useEffect } from "react";
import "../styles/documentmanagment.css";
import { io } from "socket.io-client";
import { useCookies } from "react-cookie";
import Navbar from "../components/Navbar";
import InvalidAccessPage from "../components/invalidaccesspage.js";
const DocumentPage = () => {
  const [socket, setSocket] = useState();
  const [cookies] = useCookies(["user"]);
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 8;

  var userId = null;
  if (cookies.user) {
    userId = cookies.user._id;
  }

  const handleAddDocument = () => {
    if (userId) {
      // Redirect to another page
      window.location.href = "/documents";
    }
  };

  useEffect(() => {
    if (socket == null) return;
    socket.emit("get-user-documents", userId);

    socket.on("get-user-documents", (docs) => {
      setDocuments(docs);
    });
  }, [socket, userId]);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!cookies.user) {
      return;
    }
    console.log("Fetching documents for user ID:", cookies.user._id);

    // Make a fetch or axios request to retrieve documents from your backend
    fetch("http://localhost:5000/history/retrieveDocuments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: cookies.user._id }), // Replace with the actual user ID
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            "Response not ok:",
            response.status,
            response.statusText
          );
          return Promise.reject("Fetch failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received from server:", data);

        if (data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch((error) => console.error("Error fetching documents:", error));
  }, []);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * documentsPerPage;
  const endIndex = startIndex + documentsPerPage;

  // Extract the documents to be displayed on the current page
  const displayedDocuments = documents.slice(startIndex, endIndex);

  // Function to handle pagination button clicks
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  if (!cookies.user) {
    return (
      <div class="divcontainer">
        <Navbar />
        <InvalidAccessPage />
      </div>
    );
  } else {
    return (
      <div>
        <Navbar />
        <div className="management-container">
          <h1>Document Management</h1>
          <button className="add-button" onClick={handleAddDocument}>
            Add Document
          </button>
          <div className="card-container">
            {displayedDocuments.map((document, index) => (
              <a
                key={index}
                href={`/documents/${document._id}`}
                className="document-link"
              >
                <div className="document-card">
                  <h2>{`Document ${startIndex + index + 1}`}</h2>
                  <p>Document content: {document.data}</p>
                </div>
              </a>
            ))}
          </div>
          {/* Pagination buttons */}
          <div className="pagination">
            {Array(Math.ceil(documents.length / documentsPerPage))
              .fill(0)
              .map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`pagination-button ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  }
};

export default DocumentPage;
