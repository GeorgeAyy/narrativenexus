const User = require('../models/User'); // Import the User model
const Document = require('../models/Document'); // Import the Document model
/*inviteeEmail: inviteeEmail,
      ownerId: cookies.user._id,
      documentId: documentId, */
// Function to send an invitation
exports.sendInvitation = async (req, res) => {
  try {
    console.log("the body is: " + req.body);
    // Get the owner ID, document ID, and invitee email from the request body
    const { ownerId, documentId, inviteeEmail } = req.body;

    // Find the owner and invitee by their IDs
    const owner = await User.findById(ownerId);
    const invitee = await User.findOne({ email: inviteeEmail });

    if (!owner || !invitee) {
      throw new Error('Owner or invitee not found.');
    }

    // Check if the invitee is already invited to the same document by the owner
    const existingInvitation = owner.sentInvitations.find(
      (invitation) =>
        invitation.documentId === documentId &&
        invitation.inviteeEmail === inviteeEmail
    );

    if (existingInvitation) {
      console.log('Invitation already sent to the same user for this document.');
      return res.status(400).json({ error: 'Invitation already sent' });
    }

    // Add the invitation to the owner's sentInvitations array
    owner.sentInvitations.push({
      documentId,
      inviteeEmail,
      status: 'pending', // You can set the initial status to 'pending'
    });

    // Add the invitation to the invitee's receivedInvitations array
    invitee.receivedInvitations.push({
      documentId,
      inviterId: owner._id,
      status: 'pending', // You can set the initial status to 'pending'
    });

    // Save the changes to both users
    await owner.save();
    await invitee.save();

    const successMessage = 'Invitation sent successfully.';
    console.log(successMessage);
    res.status(200).json({ message: successMessage });
  } catch (error) {
    console.error('Error sending invitation:', error);
    const errorMessage = 'An error occurred while sending the invitation.';
    res.status(500).json({ error: errorMessage });
  }
};


// Function to delete an invitation
exports.deleteInvitation = async (req, res) => {
  try {
    // Get the inviter ID (owner), invitee ID, and document ID from the request body
    const { inviterId, inviteeId, documentId } = req.body;

    // Find the inviter (owner) and invitee by their IDs
    const inviter = await User.findById(inviterId);
    const invitee = await User.findById(inviteeId);

    if (!inviter || !invitee) {
      throw new Error('Inviter or invitee not found.');
    }

    // Remove the invitation from the inviter's sentInvitations array
    inviter.sentInvitations = inviter.sentInvitations.filter(
      (invitation) =>
        invitation.documentId !== documentId &&
        invitation.inviteeId !== inviteeId
    );

    // Remove the invitation from the invitee's receivedInvitations array
    invitee.receivedInvitations = invitee.receivedInvitations.filter(
      (invitation) =>
        invitation.documentId !== documentId &&
        invitation.inviterId !== inviterId
    );

    // Save the changes to both users
    await inviter.save();
    await invitee.save();

    const successMessage = 'Invitation deleted successfully.';
    console.log(successMessage);
    res.status(200).json({ message: successMessage });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    const errorMessage = 'An error occurred while deleting the invitation.';
    res.status(500).json({ error: errorMessage });
  }
};

// Function to delete a user from the collaborators list in the Document model
exports.deleteUser = async (req, res) => {
  try {
    const { documentId, userId } = req.body;

    // Find the document by its ID
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Remove the user from the collaborators list
    document.collaborators = document.collaborators.filter((collaborator) => collaborator !== userId);

    // Save the updated document
    await document.save();

    res.status(200).json({ message: 'User removed from collaborators list' });
  } catch (error) {
    console.error('Error removing user from collaborators list:', error);
    res.status(500).json({ error: 'An error occurred while removing the user' });
  }
};

// Function to fetch collaborators for a document
exports.fetchUsers = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Find the document by its ID
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Return the list of collaborators
    res.status(200).json({ collaborators: document.collaborators });
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    res.status(500).json({ error: 'An error occurred while fetching collaborators' });
  }
};


exports.receivedInvitations = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const receivedInvitations = user.receivedInvitations;
    res.status(200).json({ receivedInvitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching invitations" });
  }
};