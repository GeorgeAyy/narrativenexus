const express = require("express");
const router = express.Router();
const {giveControl, snatchControl } = require("../controllers/documentController");


router.post("/giveControl", giveControl)
router.post("/snatchControl", snatchControl);
module.exports = router;

