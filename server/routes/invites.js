const express = require("express");
const router = express.Router();
const {
  sendInvitation,
  deleteInvitation,
  deleteUser,
  fetchUsers,
  receivedInvitations,
  acceptInvitation,
  declineInvitation
} = require("../controllers/invitesController");

// Route for sending an invitation
router.post("/sendInvitation", sendInvitation);

// Route for deleting an invitation
router.post("/deleteInvitation", deleteInvitation);

// Route for removing a user from the collaborators list
router.delete("/deleteUser", deleteUser);

// Route for fetching collaborators for a document
router.post("/fetchUsers", fetchUsers);

router.post("/getNotifications",receivedInvitations);

router.post("/acceptInvitation", acceptInvitation);

router.post("/declineInvitation", declineInvitation);

module.exports = router;
