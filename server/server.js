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
  origin: ['http://localhost:3000', 'http://20.218.101.44:3000'], // Allow requests only from these origins
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
const invitesRouter = require("./routes/invites.js");
const { findById } = require("./models/User");
const deleteDocumentRouter = require("./routes/history.js");
const editDocumentRouter = require("./routes/history.js");
app.use("/auth", authRouter);
app.use("/history", historyRouter);
app.use("/invites", invitesRouter);
app.use("/history", deleteDocumentRouter);
app.use("/history", editDocumentRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(3001, {
  cors: {
    origin: ["http://localhost:3000", "http://20.218.101.44:3000"],
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






  socket.on('get-document', async ({ documentId, userId }) => { // Receive documentId and userId
    const document = await findOrCreateDocument(documentId, userId); // Pass userId to findOrCreateDocument
  
    socket.join(documentId); // Join the room for the document
    socket.emit('load-document', {document: document.data, owner: document.owner,hasControl:document.hasControl}); // Send the document to the client
  
    socket.on('send-changes', (delta) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });
  
    socket.on('save-document', async data => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
  


})


async function findOrCreateDocument(documentId, userId) {
  if (!documentId) return;

  const document = await Document.findById(documentId);
  if (document) {
    console.log(`[MONGO] Document found:`, document);
    return document;
  }

  // Create the document with userId as the owner
  const newDocument = await Document.create({ _id: documentId, data: defaultValue, owner: userId,hasControl:userId });
  console.log(`[MONGO] Document created:`, newDocument);
  return newDocument;
}

