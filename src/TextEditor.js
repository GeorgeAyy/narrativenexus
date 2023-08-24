import { useCallback, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react';
import { set } from 'mongoose';



const TOOLBAR_OPTIONS = [
    'undo redo',            // Undo and Redo buttons
    'bold italic underline', // Basic text formatting
    'alignleft aligncenter alignright alignjustify', // Text alignment
    'bullist numlist',      // Lists (bullet and numbered)
    'link unlink',          // Insert and remove links
    'image',                // Insert images
    'table',                // Insert tables
    'formatselect',         // Format styles (headings, paragraphs, etc.)
    'fullscreen',           // Toggle fullscreen mode
];



const SAAVE_INTERVAL_MS = 2000 // save every 2 seconds


// ...

// ...

// ...

// ...

export default function TextEditor() {
    const { id: documentId } = useParams();
    const [socket, setSocket] = useState();
    const [editorContent, setEditorContent] = useState();
    const [editorLoad, setEditorLoad] = useState('');
    const [editorInstance, setEditorInstance] = useState(null);

    // Function to load the document
    const loadDocument = useCallback(() => {
        if (socket == null) return;

        socket.once('load-document', document => {
            console.log(`Loaded document: ${document}`);
            setEditorLoad(document);
        });
    }, [socket]);

    useEffect(() => {
        const s = io('http://localhost:3001');
        setSocket(s);

        return () => {
            s.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket == null) return;

        socket.emit('get-document', documentId);
        loadDocument(); // Load the document immediately when socket is available
    }, [socket, documentId, loadDocument]);

    useEffect(() => {
        console.log('saving document');
        if (socket == null || editorContent == null) return;

        const interval = setInterval(() => {
            console.log("saved" + editorContent);
            socket.emit('save-document', editorContent);
        }, SAAVE_INTERVAL_MS);

        return () => {
            clearInterval(interval); // clear the interval when we are done
        }
    }, [socket, editorContent]);

    const handleEditorChange = (content) => {
        console.log('Content was updated:', content);
        setEditorContent(content);
    };

    const handleEditorInit = (editor) => {
        setEditorInstance(editor);
        // Load the document once the editor is initialized
        loadDocument();
    };

    return (
        <div>
            <h1>TinyMCE Text Editor</h1>
            <Editor
                apiKey="bw59pp70ggqha1u9xgyiva27d1vrdvvdar1elkcj2gd51r3q"
                initialValue={editorLoad}
                onEditorChange={handleEditorChange}
                onInit={handleEditorInit}
                init={{
                    height: 500,
                    plugins: 'link image code',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | image',
                }}
            />
        </div>
    );
}
