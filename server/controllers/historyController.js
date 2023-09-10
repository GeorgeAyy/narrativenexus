const UserModel = require('../models/User');
const DocumentModel = require('../models/Document');

exports.retrieveDocuments = async (req, res) => {
    const { userId } = req.body;

    console.log("Received request to retrieve documents for userId:", userId);

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            console.log("User not found for userId:", userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("User found:", user);

        const documents = await DocumentModel.find({ _id: { $in: user.documentIds } });

        if (documents.length === 0) {
            console.log("No documents found for userId:", userId);
            return res.status(404).json({ message: 'No documents found for this user' });
        }

        console.log("Documents retrieved successfully:", documents);

        res.status(200).json({ message: 'Documents retrieved successfully', documents: documents });
    } catch (error) {
        console.error("Error retrieving documents:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.deleteDocument = async (req, res) => {
    const { documentId } = req.body; // Assuming you pass the document ID as a route parameter
    
    try {
      const deletedDocument = await DocumentModel.findByIdAndDelete(documentId);
  
      if (!deletedDocument) {
        console.log("Document not found for documentId:", documentId);
        return res.status(404).json({ message: 'Document not found' });
      }
  
      console.log("Document deleted successfully:", deletedDocument);
  
      res.status(204).send(); // Document deleted successfully, respond with 204 No Content
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.saveEditedData = async (req, res) => {
    const { documentId, editedData } = req.body;
  
    try {
      const updatedDocument = await DocumentModel.findByIdAndUpdate(
        documentId,
        { name: editedData },
        { new: true }
      );
  
      if (!updatedDocument) {
        console.log("Document not found for documentId:", documentId);
        return res.status(404).json({ message: 'Document not found' });
      }
  
      console.log("Document data updated successfully:", updatedDocument);
  
      res.status(200).json({ message: 'Document data updated successfully', document: updatedDocument });
    } catch (error) {
      console.error("Error updating document data:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };