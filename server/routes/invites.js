const express = require("express");
const router = express.Router();
const { sendInvitation} = require("../controllers/invitesController");
router.post("/sendInvitation", sendInvitation);
module.exports = router;