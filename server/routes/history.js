const express = require("express");
const router = express.Router();
const { retrieveDocuments } = require("../controllers/historyController");
router.post("/retrieveDocuments", retrieveDocuments);
module.exports = router;
