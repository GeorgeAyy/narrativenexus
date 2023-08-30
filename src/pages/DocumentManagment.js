// DocumentPage.js
import React, { useState, useEffect } from 'react';
import '../styles/documentmanagment.css';
import { io } from 'socket.io-client'
import { useCookies, removeCookie } from "react-cookie";
import { set } from 'mongoose';








const DocumentPage = () => {






    const [socket, setSocket] = useState();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [documents, setDocuments] = useState([]);

    var userId = null;
    if (cookies.user) {
        userId = cookies.user._id
    }



    const handleAddDocument = () => {
        if (userId) {
            // Redirect to another page
            // Redirect to another page
            window.location.href = "/documents";


        }
    };

    useEffect(() => {
        if (socket == null) return
        socket.emit('get-user-documents', userId)

        socket.on('get-user-documents', (docs) => {
            setDocuments(docs)

        })


    }, [socket]);




    useEffect(() => {
        const s = io('http://localhost:3001');
        setSocket(s);



        return () => {
            s.disconnect();
        }
    }, []);

    return (
        <div className="container">
            <h1>Document Management</h1>
            <button className="add-button" onClick={handleAddDocument}>
                Add Document
            </button>
            <div className="card-container">
                {documents.map((document, index) => (
                    <a key={index} href={`/documents/${document}`} className="document-link">
                        <div className="document-card">
                            <h2>{`Document ${index + 1}`}</h2>
                            <p>Document content: {document}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default DocumentPage;
