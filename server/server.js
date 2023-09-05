const config = require("./config.json");
const mongoose = require("mongoose");
const Document = require("./models/Document.js");
const User = require("./models/User.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // Session duration in milliseconds
    },
  })
);
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests only from this origin
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200, // Return a successful response
  credentials: true, // Enable cookies
};
app.use(cors(corsOptions));

mongoose
  .connect(config.mongoURI)
  .then(() => console.log(`[MONGO] Connected to MongoDB`))
  .catch((err) => console.log(`[MONGO] Error connecting to MongoDB: ${err}`));

const authRouter = require("./routes/auth.js");
const historyRouter = require("./routes/history.js");
const { findById } = require("./models/User");
app.use("/auth", authRouter);
app.use("/history", historyRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },

});

const defaultValue = "";

io.on('connection', (socket) => {



  socket.on('get-user-documents', async (userId) => {
    console.log('entered the get documents')
    if (!userId) {
      console.log("User not logged in");
      return;
    }

    try {
      const user = await User.findById(userId);

      if (!user) {
        console.log("User not found");
        return;
      }

      const documents = user.documentIds;

      socket.emit('get-user-documents', documents);

      // Emit a success event

    } catch (error) {
      console.error("Error getting documents:", error);
      // Emit an error event

    }
  })










  socket.on('attatch-document', async (documentId, userId) => {
    console.log('entered the attatch document')
    // if (userId == null) {
    //   console.log("User not logged in");
    //   return;

    // }
    // if (documentId == null) {
    //   console.log("id is null");
    //   return;
    // }
    // // if (User.findById(userId).findById(documentId)) {
    // //   console.log("User already has document");
    // //   return;
    // // } // if the user already has the document, return
    // const user = await User.findById(userId);
    // user.documentIds.push(documentId);
    // user.save();

    if (!userId) {
      console.log("User not logged in");
      return;
    }

    if (!documentId) {
      console.log("Document ID is null");
      return;
    }

    try {
      const user = await User.findById(userId);

      if (!user) {
        console.log("User not found");
        return;
      }

      // Check if the document ID is already in the user's documentIds array
      if (user.documentIds.includes(documentId)) {
        console.log("User already has the document");
        return;
      }

      // If the document ID is not already present, add it to the array
      user.documentIds.push(documentId);
      await user.save();

      // Emit a success event

    } catch (error) {
      console.error("Error attaching document:", error);
      // Emit an error event

    }






  })






  socket.on('get-document', async documentId => {  // this takes in a document id)
    const document = await findOrCreateDocument(documentId) // get document from database
    socket.join(documentId) // join the room for the document
    socket.emit('load-document', document.data) // send the document to the client


    socket.on('send-changes', (delta) => { // the delta is passed in
      console.log(delta)
      socket.broadcast.to(documentId).emit('receive-changes', delta) // broadcast to everyone else  recive changes is a function name?
    })

    socket.on('save-document', async data => { // save the document to the database
      await Document.findByIdAndUpdate(documentId, { data }) // find the document by id and update it with the data
    })
  })


})


async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) {
    console.log(`[MONGO] Document found:`, document);
    return document;
  }
  const newDocument = await Document.create({ _id: id, data: defaultValue });
  console.log(`[MONGO] Document created:`, newDocument);
  return newDocument;
}

