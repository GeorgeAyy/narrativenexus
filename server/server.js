const config = require("./config.json");
const mongoose = require("mongoose");
const Document = require("./models/Document.js");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const session = require("express-session");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
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
    app.use("/auth", authRouter);


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

io.on("connection", (socket) => {
  console.log(`[SOCKET] User connected`);

  socket.on("get-document", async (documentId) => {
    console.log(`[SOCKET] Getting document for ID: ${documentId}`);
    const document = await findOrCreateDocument(documentId);
    console.log(`[SOCKET] Document loaded:`, document);
    socket.join(documentId);
    socket.emit("load-document", document.data);
  });

  socket.on("send-changes", (delta) => {
    console.log(`[SOCKET] Received changes:`, delta);
    socket.broadcast.to(documentId).emit("receive-changes", delta);
  });

  socket.on("save-document", async (data) => {
    console.log(`[SOCKET] Saving document data:`, data);
    await Document.findByIdAndUpdate(documentId, { data });
    console.log(`[SOCKET] Document data saved`);
  });
});



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

