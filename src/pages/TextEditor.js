
import { useCallback, useEffect, useRef, useState } from 'react'

import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react';
import ReactLoading from "react-loading";
import { openPopupGrammarChecker } from "../Utils/grammarchecker";
import { openPopupSummaryandParaphrase } from "../Utils/summaryandparaphrasePopup";
import { useCookies, removeCookie } from "react-cookie";
import Navbar from '../components/Navbar';
import InvalidAccessPage from '../components/invalidaccesspage';
import HistorySidebar from '../components/histoySidebar'; // Import the HistorySidebar component
import UserManagementPopup from '../components/UserManagementPopup';
import "../styles/App.css";
import config from '../config.json';

// import { use } from '../../server/routes/auth';







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

  const editorRef = useRef(null);
  const [grammerChecker, setGrammerChecker] = useState(false);
  const [summarizer, setSummarizer] = useState(false);

  const [Paraphraser, setParaphraser] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  // Define variables for auto-completion

  const [autoCompleteTimer, setAutoCompleteTimer] = useState(null); // Define autoCompleteTimer

  const [editorChangeEnabled, setEditorChangeEnabled] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true); // New state for sidebar open/closed
  const [history, setHistory] = useState([]); // To store history entries
  const [isUserManagementPopupOpen, setIsUserManagementPopupOpen] = useState(false);
  const [documentOwner, setDocumentOwner] = useState(null); // To store the document owner
  const [documentContent, setDocumentContent] = useState('');
  const [hasControl, setHasControl] = useState(null); // To store the document owner
  const [documentCollaborators, setDocumentCollaborators] = useState([]); // To store the document owner

  useEffect(() => {
    if (socket == null) return;
    // Listen for control-snatched event
    socket.on('control-snatched', ({ documentId }) => {
      window.location.href = `/documents/${documentId}`;
    });

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off('control-snatched');
    };
  }, [socket]);




  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [autoCompleteEnabled, setAutoCompleteEnabled] = useState(true);
  const targetColor = '#a9a9ac';
  var userId = null;
  if (cookies.user) {
    userId = cookies.user._id
  }

  // Function to load the document
  const loadDocument = useCallback(() => {
    if (socket == null) return;

    socket.once('load-document', ({ document, owner, hasControl, collaborators }) => { // Receive document and owner
      console.log(`Loaded document: ${document}`);
      setEditorLoad(document);
      setHasControl(hasControl)
      // Now you have access to both document and owner in your state
      setDocumentOwner(owner); // Assuming you have a state variable to store the owner
      setDocumentContent(document);
      console.log("Owner: " + owner)
      collaborators.push(owner);
      console.log("updatedCollaborators: " + collaborators)
      setDocumentCollaborators(collaborators);

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


  const giveControl = async (userId) => {
    try {
      const response = await fetch(`http://${config.ip}:5000/documentRoute/giveControl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId, userId, ownerId: cookies.user._id }),
      });

      if (response.ok) {
        socket.emit('control-snatched', { documentId });
        window.location.href = `/documents/${documentId}`;
      } else {
        console.error('Failed to give control');
      }
    } catch (error) {
      console.error('Error giving control:', error);
    }
  };

  const snatchControl = async () => {

    try {
      const response = await fetch(`http://${config.ip}:5000/documentRoute/snatchControl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId, userId, ownerId: cookies.user._id }),
      });

      if (response.ok) {
        socket.emit('control-snatched', { documentId });
        window.location.href = `/documents/${documentId}`;

      } else {
        console.error('Failed to snatch control');
      }
    } catch (error) {
      console.error('Error snatching control:', error);
    }
  };


  const openUserManagementPopup = () => {
    setIsUserManagementPopupOpen(true);
  };

  const closeUserManagementPopup = () => {
    setIsUserManagementPopupOpen(false);
  };




  useEffect(() => {
    if (socket == null || userId == null) return;

    socket.emit('attatch-document', documentId, userId);


  }, [socket]);


  useEffect(() => {
    const s = io(`http://${config.ip}:3001`);
    setSocket(s);



    return () => {
      s.disconnect();
    }
  }, []);

  useEffect(() => {

    if (socket == null || !cookies.user) return;

    socket.emit('get-document', { documentId, userId: cookies.user._id }); // Pass userId to the server
    loadDocument(); // Load the document immediately when socket is available

  }, [socket, documentId, loadDocument, cookies.user._id]);

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

  useEffect(() => {
    if (socket == null) return;

    socket.on('receive-history', (newHistory) => {
      setHistory(newHistory);
    });

    return () => {
      socket.off('receive-history');
    };


  }, [socket]);


  useEffect(() => {

    if (!cookies.user) return;
    console.log("Fetching documents for user ID:", cookies.user._id);

    // Make a fetch or axios request to retrieve documents from your backend
    fetch(`http://${config.ip}:5000/history/retrieveDocuments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: cookies.user._id }), // Replace with the actual user ID
    })

      .then((response) => {
        if (!response.ok) {
          console.error('Response not ok:', response.status, response.statusText);
          return Promise.reject('Fetch failed');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received from server:", data);


        if (data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch((error) => console.error('Error fetching documents:', error));
  }, [document]);


  const handleEditorChange = (content) => {
    console.log('Content was updated:', content);

    if (editorChangeEnabled) {
      setEditorContent(content);
      socket.emit('send-changes', content);
      // Clear the auto-complete timer on content change
      clearTimeout(autoCompleteTimer);

      // Start a new auto-complete timer only if content is not empty
      if (content.trim() !== "") {
        const timer = setTimeout(() => {
          if (editorChangeEnabled && autoCompleteEnabled) {
            sendTextForAutoComplete(content); // Send the text for auto-completion
            setAutoCompleteEnabled(false);
          } else {
            setEditorChangeEnabled(true);
            setAutoCompleteEnabled(true);
          }
        }, 2000);

        setAutoCompleteTimer(timer);
      }
      else {
        setEditorChangeEnabled(true);
      }
    } else {
      setEditorChangeEnabled(true);
    }
  };


  const handleEditorInit = (evt, editor) => {
    // Load the document once the editor is initialized
    loadDocument();
    editorRef.current = editor;

    const edit = editorRef.current; // Assuming you have a reference to the editor instance
    // Color you want to remove
    // let autoCompleteEnabled = true;

    // Add a keydown event listener to the editor
    edit.on('keydown', event => {
      if (event.keyCode === 9) {

        event.preventDefault();
        if (true) {
          // Prevent default Tab behavior


          // Get the content of the editor
          editor.dom.select(`span[style="color: ${targetColor};"]`).forEach(span => {
            const parent = span.parentNode;
            while (span.firstChild) {
              parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
          });

          // autoCompleteEnabled = false; // Disable further autocomplete
        }
      } else {
        // Check if the pressed key is not the Tab key (key code: 9)
        const contentDocument = editor.getDoc();
        const textNodes = contentDocument.querySelectorAll(`span[style="color: ${targetColor};"]`);

        // Remove the parent nodes of the matched text nodes
        textNodes.forEach(textNode => {
          const parentNode = textNode.parentNode;
          parentNode.removeChild(textNode);
        });
      }
    });
  };





  const sendTextForAutoComplete = async (text) => {

    try {
      const data = {
        text: text,
      };
      const response = await fetch(`http://${config.ip}:3002/api/autocomplete/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          data
        ),
      });

      const reply = await response.json();
      console.log("the reply is: " + reply);
      // Temporarily remove the change event listener
      setEditorChangeEnabled(false);
      const myStyle = { color: '#a9a9ac' }; // Change color to red

      // Construct the style string from the myStyle object
      const styleString = Object.keys(myStyle)
        .map(key => `${key}: ${myStyle[key]};`)
        .join(' ');

      // Use the insertContent method to append the reply to the current selection
      editorRef.current.selection.setContent(`<span style="${styleString}">${reply}</span>`);
      // Re-enable the change event listener after a short delay (e.g., 200 milliseconds)

    } catch (error) {
      console.error('Error fetching auto-complete suggestions:', error);
    }
  };



  const isUserCollaborator = documentCollaborators.includes(cookies.user._id);
  console.log("isUserCollaborator: " + isUserCollaborator)
  console.log("cookies.user._id: " + cookies.user._id)
  console.log("documentCollaborators: " + documentCollaborators)
  console.log("hasControl: " + hasControl)
  if ((!cookies.user || !isUserCollaborator)) {

    return (
      <div className="divcontainer">
        <Navbar />
        <InvalidAccessPage />
      </div>
    );

  } else {
    return (
      <div>

        <Navbar />


        {isUserManagementPopupOpen && (
          <div className="overlay"></div>
        )}


        {grammerChecker || summarizer || Paraphraser ? (
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
        <div className="editor-page">

          <HistorySidebar documents={documents} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={`editor-container ${sidebarOpen ? '' : 'full-width'}`}>


            <h1>Narrative Nexus Editor</h1>
            <span style={{ display: "flex" }}>
              <button className="toggle-history-button" onClick={toggleSidebar}>
                {sidebarOpen ? 'Close History' : 'Open History'}
              </button>
              {cookies.user._id === documentOwner && (
                <button className="toggle-history-button" onClick={openUserManagementPopup}>
                  Invite/Edit Users
                </button>
              )}
            </span>

            {console.log("the document owner is: " + cookies.user._id)}
            {hasControl === cookies.user._id ? (
              <Editor
                apiKey="bw59pp70ggqha1u9xgyiva27d1vrdvvdar1elkcj2gd51r3q"
                initialValue={editorLoad}
                onEditorChange={handleEditorChange}
                onInit={handleEditorInit}
                init={{
                  height: 550,
                  menubar: true,
                  plugins: ["image ", "link ", " code"],
                  toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code | image| GrammarChecker| SummarizeText | ParaphraseText",
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
                            `http://${config.ip}:3002/api/grammar-correction/`,
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
                                `<span className="incorrecttext">` +
                                incorrectText.substring(start, end) +
                                "</span>" +
                                incorrectText.substring(end);

                              mistakes.push(rearrangedText);
                              mistakes.push(`<b>Error : </b> ` + match[8]);
                              mistakes.push(`<b>${match[1]}</b> `);
                              mistakes.push(
                                `<b>Suggestions : </b> <span className="suggestions">` +
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
                    editor.ui.registry.addButton("SummarizeText", {
                      text: "Summarize Text",
                      tooltip: "Summarize the selected text",
                      onAction: async () => {
                        const selection = editor.selection.getContent();

                        if (selection !== "") {
                          setSummarizer(true);
                          const data = {
                            text: selection,
                            action: 'summarize',
                          };
                          const response = await fetch(
                            `http://${config.ip}:3002/api/process_text/`, // Change the URL to your summarization API endpoint
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify(data),
                            }
                          );

                          const result = await response.json();
                          setSummarizer(false);

                          openPopupSummaryandParaphrase(result, editor);


                        } else {
                          alert("Please select a sentence");
                        }
                      },
                    });

                    editor.ui.registry.addButton("ParaphraseText", {
                      text: "Paraphrase Text",
                      tooltip: "Paraphrase the selected text",
                      onAction: async () => {
                        const selection = editor.selection.getContent();

                        if (selection !== "") {
                          setParaphraser(true);
                          const data = {
                            text: selection,
                            action: 'paraphrase',
                          };
                          const response = await fetch(
                            `http://${config.ip}:3002/api/process_text/`, // Change the URL to your summarization API endpoint
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify(data),
                            }
                          );

                          const answer = await response.json();
                          setParaphraser(false);

                          openPopupSummaryandParaphrase(answer, editor);

                        } else {
                          alert("Please select a sentence");
                        }
                      },
                    });

                  },
                }}
              />

            ) : (
              <div>
                <div className="center-container">
                  {/* Replace the textarea with a span */}
                  <span
                    id="spectate-span" // You can set an id or className as needed
                    dangerouslySetInnerHTML={{ __html: documentContent }}
                  ></span>
                </div>

              </div>
            )}
          </div>




        </div >

        {
          isUserManagementPopupOpen && (
            <UserManagementPopup ownerId={cookies.user._id} documentId={documentId} closeUserManagementPopup={closeUserManagementPopup} giveControl={giveControl} snatchControl={snatchControl} />
          )
        }
      </div >
    );
  }
}