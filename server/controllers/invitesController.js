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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matchingInvitation = user.receivedInvitations.find(invitation => invitation.documentId === documentId);
    console.log("Owner Id: "+ matchingInvitation.inviterId);
    const owner = await User.findById(matchingInvitation.inviterId);
    console.log("Owner: "+ owner);
    // Remove the invitation from the user's receivedInvitations
    user.receivedInvitations = user.receivedInvitations.filter((invitation) => invitation.documentId !== documentId);

    // Remove the invitation from the owner's sentInvitations
    owner.sentInvitations = owner.sentInvitations.filter((invitation) => invitation.documentId !== documentId);

    // Save the updated users
    await user.save();
    await owner.save();
    // Save the updated document
    await document.save();




    res.status(200).json({ message: 'User removed from collaborators list, and invitations removed' });
  } catch (error) {
    console.error('Error removing user and invitations:', error);
    res.status(500).json({ error: 'An error occurred while removing the user and invitations' });
  }
};



// Function to fetch collaborators for a document
exports.fetchUsers = async (req, res) => {
  try {
    const { documentId } = req.body;

    // Find the document by its ID
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Get the IDs of collaborators from the document
    const collaboratorIds = document.collaborators;

    // Fetch the users based on the collaborator IDs
    const users = await User.find({ _id: { $in: collaboratorIds } }, 'name');

    // Create an array of collaborator objects with names
    const collaboratorsWithNames = users.map(user => ({
      id: user._id,
      name: user.name,
    }));

    // Return the list of collaborators with names
    res.status(200).json({ collaborators: collaboratorsWithNames });
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
    const inviterIds = receivedInvitations.map(invitation => invitation.inviterId);

    // Fetch the names of the inviters
    const inviters = await User.find({ _id: { $in: inviterIds } }, 'name');

    // Combine received invitations with inviter names
    const invitationsWithNames = receivedInvitations.map(invitation => {
      const inviter = inviters.find(user => user._id.toString() === invitation.inviterId.toString());
      return {
        ...invitation.toObject(),
        inviterName: inviter ? inviter.name : 'Unknown', // Set to 'Unknown' if inviter not found
      };
    });

    res.status(200).json({ receivedInvitations: invitationsWithNames });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ error: "An error occurred while fetching invitations" });
  }
};


// invitesController.js

// Function to accept an invitation
exports.acceptInvitation = async (req, res) => {
  try {
    // Get the owner ID, document ID, and invitee email from the request body
    const { ownerId, documentId, inviteeEmail } = req.body;

    // Find the owner and invitee by their IDs
    const owner = await User.findById(ownerId);
    const invitee = await User.findOne({ email: inviteeEmail });

    if (!owner || !invitee) {
      console.error('Owner or invitee not found.');
      throw new Error('Owner or invitee not found.');
    }

    console.log(`Accepting invitation: Owner - ${owner.name}, Invitee - ${invitee.name}, Document - ${documentId}`);

    // Update the invitation status to 'accepted'
    const invitationIndex = owner.sentInvitations.findIndex(
      (invitation) =>
        invitation.documentId === documentId &&
        invitation.inviteeEmail === inviteeEmail
    );

    if (invitationIndex !== -1) {
      owner.sentInvitations[invitationIndex].status = 'accepted';
      await owner.save();

      console.log(`Invitation marked as accepted for Document - ${documentId}`);

      // Update the invitee's receivedInvitations
      const inviteeInvitationIndex = invitee.receivedInvitations.findIndex(
        (invitation) =>
          invitation.documentId === documentId &&
          invitation.inviterId.toString() === owner._id.toString()
      );

      if (inviteeInvitationIndex !== -1) {
        invitee.receivedInvitations[inviteeInvitationIndex].status = 'accepted';
        await invitee.save();

        console.log(`Invitee's receivedInvitations updated for Document - ${documentId}`);
      } else {
        console.log(`Invitee's receivedInvitations not found for Document - ${documentId}`);
      }

      // Add the invitee to the document's collaborators list
      const document = await Document.findById(documentId);
      if (!document) {
        console.error('Document not found.');
        throw new Error('Document not found.');
      }

      console.log(`Adding invitee to collaborators list for Document - ${documentId}`);

      document.collaborators.push(invitee._id); // Assuming invitee._id is the user's ID
      await document.save();

      // Add the documentId to the list of documentIds for the user
      if (!owner.documentIds.includes(documentId)) {
        owner.documentIds.push(documentId);
        await owner.save();
        console.log(`Added Document - ${documentId} to the user's documentIds.`);
      }
    }

    const successMessage = 'Invitation accepted successfully.';
    console.log(successMessage);
    res.status(200).json({ message: successMessage });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    const errorMessage = 'An error occurred while accepting the invitation.';
    res.status(500).json({ error: errorMessage });
  }
};


// Function to decline an invitation
exports.declineInvitation = async (req, res) => {
  try {
    // Get the owner ID, document ID, and invitee email from the request body
    const { ownerId, documentId, inviteeEmail } = req.body;

    // Find the owner and invitee by their IDs
    const owner = await User.findById(ownerId);
    const invitee = await User.findOne({ email: inviteeEmail });

    if (!owner || !invitee) {
      console.error('Owner or invitee not found.');
      throw new Error('Owner or invitee not found.');
    }

    console.log(`Declining invitation: Owner - ${owner.name}, Invitee - ${invitee.name}, Document - ${documentId}`);

    // Remove the invitation from the owner's sentInvitations
    owner.sentInvitations = owner.sentInvitations.filter(
      (invitation) =>
        invitation.documentId !== documentId &&
        invitation.inviteeEmail !== inviteeEmail
    );

    await owner.save();

    console.log(`Invitation removed from owner's sentInvitations for Document - ${documentId}`);

    // Remove the invitation from the invitee's receivedInvitations
    invitee.receivedInvitations = invitee.receivedInvitations.filter(
      (invitation) =>
        invitation.documentId !== documentId &&
        invitation.inviterId.toString() === owner._id.toString()
    );

    await invitee.save();

    console.log(`Invitation removed from invitee's receivedInvitations for Document - ${documentId}`);

    const successMessage = 'Invitation declined successfully.';
    console.log(successMessage);
    res.status(200).json({ message: successMessage });
  } catch (error) {
    console.error('Error declining invitation:', error);
    const errorMessage = 'An error occurred while declining the invitation.';
    res.status(500).json({ error: errorMessage });
  }
};
