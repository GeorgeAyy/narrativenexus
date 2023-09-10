// historyRoutes.js

const express = require("express");
const router = express.Router();
const { retrieveDocuments, deleteDocument, saveEditedData } = require("../controllers/historyController");

router.post("/retrieveDocuments", retrieveDocuments);
router.delete("/deleteDocument", deleteDocument);
router.put("/saveEditedData", saveEditedData); // Add a PUT route for editing documents

module.exports = router;