import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import "../styles/documentmanagment.css";
import { io } from "socket.io-client";
import { useCookies } from "react-cookie";
import Navbar from "../components/Navbar";
import config from '../config.json';

function stripHtmlTags(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}




const SpectatePage = () => {
    const { id: documentId } = useParams();
    const [socket, setSocket] = useState();
    const [cookies] = useCookies(["user"]);
    const [documents, setDocuments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const documentsPerPage = 8;
    const [documentContent, setDocumentContent] = useState('');

    var userId = null;
    if (cookies.user) {
        userId = cookies.user._id;
    }


    useEffect(() => {
        const s = io(`http://${config.ip}:3001`);
        setSocket(s);



        return () => {
            s.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket == null) return;
        socket.emit('get-document', { documentId, userId: cookies.user._id });
        socket.once('load-document', ({ document, owner }) => { // Receive document and owner

            setDocumentContent(document);

        });
    }, [socket]);

    const handler = (delta) => {
        ;
        setDocumentContent(stripHtmlTags(delta));
    }
    useEffect(() => {

        if (socket == null) return;

        socket.on('receive-changes', handler);



        return () => {

            socket.off('receive-changes');

        };



    }, [socket]);



    return (

        <div>

            <Navbar />

            <div className="center-container">
                <textarea
                    rows="10"
                    cols="50"
                    value={documentContent}
                    readOnly
                    id="spectate-textarea"

                />


            </div>
        </div>
    )

}


export default SpectatePage;