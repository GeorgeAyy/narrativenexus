import { useCallback, useEffect, useRef, useState } from 'react'

import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react';






const SAAVE_INTERVAL_MS = 2000 // save every 2 seconds




export default function TextEditor() {
    const { id: documentId } = useParams() // this id is the same name as the one in the url and here we rename it to document id
    const [socket, setSocket] = useState()
    const [quill, setTiny] = useState()

    // to svae the document
    useEffect(() => {
        if (socket == null || quill == null) return

        const interval = setInterval(() => {
            socket.emit('save-document', quill.getContents())
        }, SAAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval) // clear the interval when we are done
        }



    }, [socket, quill]) // we want to run this when the socket and quill changes


    useEffect(() => {
        if (socket == null || quill == null) return // if socket or quill is null then we dont want to do anything


        //listening to the event once, will automatically clean up the event after listening once
        socket.once('load-document', document => {
            quill.setContents(document)      // so that we can load up our text editor
            quill.enable()                   // enable the editor bec we disabled it when we are  loading the document
        })


        socket.emit('get-document', documentId) // sending to the server they document id to attach us to the room for the document or send us the one document if it is present?
    }, [socket, quill, documentId])





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

    const wrapperRef = useCallback((wrapper) => {                        // using callback and passing it to our ref
        // disable the editor until we load the document



    }, [])
    return (<div>
        <h1>TinyMCE Text Editor</h1>
        <Editor
            apiKey="bw59pp70ggqha1u9xgyiva27d1vrdvvdar1elkcj2gd51r3q"
            init={{
                height: 500,
                plugins: 'link image code, spellchecker', // Include the spellchecker plugin
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | image',
                // Other TinyMCE configurations

                spellchecker_callback: function (method, text, success, failure) {
                    var words = text.match(this.getWordCharPattern());
                    if (method === "spellcheck") {
                        var suggestions = {};
                        for (var i = 0; i < words.length; i++) {
                            suggestions[words[i]] = ["First", "Second"];
                        }
                        success({ words: suggestions, dictionary: [] });
                    } else if (method === "addToDictionary") {
                        // Add word to dictionary here
                        success();
                    }
                }
            }}
        />
    </div>)
}
