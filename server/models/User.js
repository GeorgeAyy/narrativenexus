const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  documentIds: {
    type: [String], // Array of strings
    default: [], // Default value is an empty array
  },
  sentInvitations: [
    {
      documentId: String, // ID of the document being shared
      inviteeEmail: String, // Email of the user being invited
      status: String, // Invitation status (e.g., 'pending', 'accepted', 'declined')
    },
  ],
  receivedInvitations: [
    {
      documentId: String, // ID of the document shared with the user
      inviterId: String, // ID of the user who sent the invitation
      status: String, // Invitation status (e.g., 'pending', 'accepted', 'declined')
    },
  ],
});

module.exports = model("User", userSchema);
