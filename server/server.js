const config = require('./config.json');
const mongoose = require('mongoose') // import mongoose
const Document = require('./Document') // import the document model




mongoose.connect(config.mongoURI)
    .then(() => console.log(`[MONGO] Connected to MongoDB`))
    .catch((err) => console.log(`[MONGO] Error connecting to MongoDB: ${err}`));


const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }                           // for corss origin request support (make request from a diffrent url to a diffrent url since server and client are on diffrent locations)


});

const defaultValue = '' // default value for the document

io.on('connection', (socket) => {
    socket.on('get-document', async documentId => {  // this takes in a document id)
        const document = await findOrCreateDocument(documentId) // get document from database
        socket.join(documentId) // join the room for the document
        socket.emit('load-document', document.data) // send the document to the client


        socket.on('send-changes', (delta) => { // the delta is passed in
            socket.broadcast.to(documentId).emit('receive-changes', delta) // broadcast to everyone else  recive changes is a function name?
        })

        socket.on('save-document', async data => { // save the document to the database
            await Document.findByIdAndUpdate(documentId, { data }) // find the document by id and update it with the data
        })
    })


})

async function findOrCreateDocument(id) {
    if (id == null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })

}
