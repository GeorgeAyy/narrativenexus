import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import "../styles/documentmanagment.css";
import { io } from "socket.io-client";
import { useCookies } from "react-cookie";
import Navbar from "../components/Navbar";
import config from '../config.json';







const SpectatePage = () => {
    const { id: documentId } = useParams();
    const [socket, setSocket] = useState();
    const [cookies] = useCookies(["user"]);
    const [documentContent, setDocumentContent] = useState('');




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
        setDocumentContent(delta);
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
                {/* Replace the textarea with a span */}
                <span
                    id="spectate-span" // You can set an id or className as needed
                    dangerouslySetInnerHTML={{ __html: documentContent }}
                ></span>
            </div>

        </div>
    )

}


export default SpectatePage;