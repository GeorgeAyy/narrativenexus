import { useCallback, useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import "quill/dist/quill.snow.css"; // the styles for the editor
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'

const Font = Quill.import('attributors/style/font'); // import font style
Font.whitelist = ['Arial', 'Verdana', 'Roboto']; // whitelist fonts
Quill.register(Font, true); // register fonts


const SAAVE_INTERVAL_MS = 2000 // save every 2 seconds
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // header options
    [{ font: Font.whitelist }], // use whitelisted fonts
    [{ list: 'ordered' }, { list: 'bullet' }], // list options
    ['bold', 'italic', 'underline'], // style options
    [{ color: [] }, { background: [] }], // color options
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ align: [] }], // text align options
    ['image', 'blockquote', 'code-block'], // embeds
    ['clean']] // remove formatting button




export default function TextEditor() {
    const { id:documentId } = useParams() // this id is the same name as the one in the url and here we rename it to document id
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()

    // to svae the document
    useEffect(() => {
        if (socket == null || quill == null) return 

        const interval = setInterval(() => {
            socket.emit('save-document' , quill.getContents())
        }, SAAVE_INTERVAL_MS)

        return() => {
            clearInterval(interval) // clear the interval when we are done
        }



    }, [socket, quill]) // we want to run this when the socket and quill changes


    useEffect(() => {
        if(socket== null || quill == null) return // if socket or quill is null then we dont want to do anything


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
        if (wrapper == null) return                                     // if wrapper is null then we dont want to do anything
        wrapper.innerHTML = ''                                          //every time we run this we want to reset this
        const editor = document.createElement('div')
        wrapper.append(editor)                                          //current to get the current ref
        const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } })                            // quill will be using the editor
        q.disable()                                                  // disable the editor until we load the document
        q.setText('loading...')                                               // disable the editor until we load the document
        setQuill(q)

    }, [])
    return <div className='container' ref={wrapperRef}></div>
}
