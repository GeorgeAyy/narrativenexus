import { useCallback, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react';


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


export default function TextEditor() {
    const { id: documentId } = useParams() // this id is the same name as the one in the url and here we rename it to document id
    const [socket, setSocket] = useState()
    const [tiny, setTiny] = useState()
    const [editorContent, setEditorContent] = useState() // this is the content of the document
    const [editorInstance, setEditorInstance] = useState(null);
    const [quill, setQuill] = useState()
    const editorRef = useRef(null); // Create a ref to hold the editor instance


    // to svae the document
    useEffect(() => {
        console.log('saving document')
        if (socket == null || editorContent == null) return

        const interval = setInterval(() => {
            console.log(editorContent)
            socket.emit('save-document', editorContent)

        }, SAAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval) // clear the interval when we are done
        }



    }, [socket, editorContent]) // we want to run this when the socket and quill changes


    useEffect(() => {
        if (socket == null || tiny == null) return // if socket or quill is null then we dont want to do anything


        //listening to the event once, will automatically clean up the event after listening once
        socket.once('load-document', document => {
            // enable the editor bec we disabled it when we are  loading the document
        })


        socket.emit('get-document', documentId) // sending to the server they document id to attach us to the room for the document or send us the one document if it is present?
    }, [socket, tiny, documentId])





    useEffect(() => {
        const s = io('http://localhost:3001') // this is the url of the server.  here we connect
        setSocket(s)

        return () => {
            s.disconnect() // disconnect when we are done
        }

    }, []) // the [] I think is to make sure it only runs once

    useEffect(() => {
        if (socket == null || quill == null) return             // if socket or quill is null then we dont want to do anything

        const handler = (delta) => {
            quill.updateContents(delta)                 // update the quill with the delta
        }
        socket.on('receive-changes', handler)
        // send the changes to the server


        return () => {
            socket.off('receive-changes', handler) // remove the listener when we are done

        }
    }, [socket, quill]) // we want to run this when the socket and quill changes

    useEffect(() => {
        if (socket == null || quill == null) return // if socket or quill is null then we dont want to do anything

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return // only want to track the user made
            socket.emit('send-changes', delta)
        }
        quill.on('text-change', handler) // this is a listener for the text change event
        // send the changes to the server


        return () => {
            quill.off('text-change', handler) // remove the listener when we are done

        }
    }, [socket, quill]) // we want to run this when the socket and quill changes

    // const wrapperRef = useCallback((wrapper) => {                        // using callback and passing it to our ref
    //     if (wrapper == null) return                                     // if wrapper is null then we dont want to do anything
    //     wrapper.innerHTML = ''                                          //every time we run this we want to reset this
    //     const editor = document.createElement('div')
    //     wrapper.append(editor)                                          //current to get the current ref
    //     const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } })                            // quill will be using the editor
    //     q.disable()                                                  // disable the editor until we load the document
    //     q.setText('loading...')                                               // disable the editor until we load the document
    //     setQuill(q)



    // }, [])




    const handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
        // editorRef.current = editor; // Store the editor instance
        setTiny(editor);
        setEditorContent(content)
    };

    const handleEditorInit = (editor) => {
        // get the previous data
        socket.once('load-document', document => {
            console.log(`the document is ${document}`)

        })

        // set the initial contents of the editor

    };


    return (<div>
        <h1>TinyMCE Text Editor</h1>
        <Editor
            apiKey="bw59pp70ggqha1u9xgyiva27d1vrdvvdar1elkcj2gd51r3q"
            init={{
                height: 500,
                plugins: 'link image code, spellchecker', // Include the spellchecker plugin
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | image',



            }}
            onEditorChange={handleEditorChange}
            onInit={handleEditorInit}
        />
    </div>)
}

