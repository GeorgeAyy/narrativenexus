const User = require('../models/User'); // Import the User model
const Document = require('../models/Document'); // Import the Document model

exports.giveControl = async (req, res) => {
    const { documentId, userId, ownerId } = req.body;
    console.log("the request is", req.body);
    try {
      console.log('Received giveControl request with documentId:', documentId, 'userId:', userId, 'ownerId:', ownerId);
  
      // Check if the user making the request is the document owner (you should implement proper authentication)
      const document = await Document.findById(documentId);
  
      if (!document) {
        console.log('Document not found.');
        return res.status(404).json({ error: 'Document not found.' });
      }
  
      console.log('Found document:', document);
  
      const isOwner = ownerId == document.owner;
      console.log('Is owner:', isOwner);
  
      if (isOwner) {
        // Update the 'hasControl' property of the document in your database
        document.hasControl = userId; // Assign control to the user with userId
        await document.save();
        console.log('Control given successfully.');
        return res.status(200).json({ message: 'Control given successfully.' });
      } else {
        console.log('Not authorized to give control.');
        res.status(403).json({ error: 'You are not authorized to give control.' });
      }
    } catch (error) {
      console.error('Error giving control:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  

exports.snatchControl = async (req, res) => {
    const { documentId, userId, ownerId } = req.body;
  
    try {
        const document = await Document.findById(documentId);
        console.log("the document is", document)
        if(!document) {
            console.log("Document not found");
            return res.status(404).json({ error: 'Document not found.' });
        }
      // Check if the user making the request is the document owner (you should implement proper authentication)
        const isOwner = ownerId == document.owner;
      if (isOwner) {
        
          document.hasControl = document.owner; // Set the owner's ID as the hasControl
          await document.save();
          res.status(200).json({ message: 'Control snatched successfully.' });
         
      } else {
        res.status(403).json({ error: 'You are not authorized to snatch control.' });
      }
    } catch (error) {
      console.error('Error snatching control:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  