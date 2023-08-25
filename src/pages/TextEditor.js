
import { useCallback, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react';
import ReactLoading from "react-loading";
import { openPopupGrammarChecker } from "../Utils/grammarchecker";
import { set } from 'mongoose';
import "../styles/App.css";



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
    const editorRef = useRef(null);
    const [grammerChecker, setGrammerChecker] = useState(false);
  
  
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

    const handleEditorInit = (evt,editor) => {
        setEditorInstance(editor);
        // Load the document once the editor is initialized
        loadDocument();
        editorRef.current = editor;
    };

    return (
        <div style={{padding: "5%"}}>
        {grammerChecker ? (
          <ReactLoading
            type={"spin"}
            color="#0A99E5"
            height={100}
            width={100}
            className="ReactLoading"
          />
        ) : (
          <></>
        )}
            <h1>TinyMCE Text Editor</h1>
            
            
            <Editor
                apiKey="bw59pp70ggqha1u9xgyiva27d1vrdvvdar1elkcj2gd51r3q"
                initialValue={editorLoad}
                onEditorChange={handleEditorChange}
                onInit={handleEditorInit}
                init={{
                    height: 500,
                    menubar: true, 
                    plugins: ["image ", "link "," code"],
                    toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code | image| GrammarChecker",
                    setup: (editor) => {
                      editor.ui.registry.addButton("GrammarChecker", {
                        text: "Grammar Checker",
                        icon: "highlight-bg-color",
                        tooltip:
                          "Highlight a prompt and click this button to query ChatGPT",
                        enabled: true,
                        onAction: async () => {
                          const selection = editor.selection.getContent();
          
                          if (selection !== "") {
                            setGrammerChecker(true);
                            const data = {
                              text: selection,
                            };
                            const response = await fetch(
                              "http://127.0.0.1:8000/api/grammar-correction/",
                              {
                                method: "POST", // *GET, POST, PUT, DELETE, etc.
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data), // body data type must match "Content-Type" header
                              }
                            );
                            response.json().then((response) => {
                              setGrammerChecker(false);
                              let correctedText = response.corrected_text;
                              let matches = response.matches;
                              let grammarMistakes = [];
                              for (let match of matches) {
                                let mistakes = [];
          
                                let incorrectText = match[4];
                                // Calculate the start and end positions for the span element
                                let start = match[3];
                                let end = match[3] + match[6];
          
                                // Rearrange the incorrectText with the span element
                                let rearrangedText =
                                  incorrectText.substring(0, start) +
                                  `<span class="incorrecttext">` +
                                  incorrectText.substring(start, end) +
                                  "</span>" +
                                  incorrectText.substring(end);
          
                                mistakes.push(rearrangedText);
                                mistakes.push(`<b>Error : </b> ` + match[8]);
                                mistakes.push(`<b>${match[1]}</b> `);
                                mistakes.push(
                                  `<b>Suggestions : </b> <span class="suggestions">` +
                                    match[2].slice(0, 2) +
                                    "</span>"
                                );
          
                                grammarMistakes.push(mistakes);
                              }
          
                              openPopupGrammarChecker(
                                grammarMistakes,
                                editor,
                                correctedText,
                                matches.length
                              );
                            });
                          } else {
                            alert("Please select a sentence");
                          }
                        },
                      });
                    },
                  }}
            />
        </div>
    );
}