const express = require("express");
const router = express.Router();
const {
  sendInvitation,
  deleteInvitation,
  deleteUser,
  fetchUsers
} = require("../controllers/invitesController");

// Route for sending an invitation
router.post("/sendInvitation", sendInvitation);

// Route for deleting an invitation
router.post("/deleteInvitation", deleteInvitation);

// Route for removing a user from the collaborators list
router.delete("/deleteUser", deleteUser);

// Route for fetching collaborators for a document
router.get("/:documentId/users", fetchUsers);

module.exports = router;
