const express = require("express");
const router = express.Router();
const { retrieveDocuments } = require("../controllers/historyController");
const { deleteDocument } = require("../controllers/historyController")
router.post("/retrieveDocuments", retrieveDocuments);
router.delete("/deleteDocument", deleteDocument);
module.exports = router;
