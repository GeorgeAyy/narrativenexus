const UserModel = require("../models/User");
const DocumentModel = require("../models/Document");

exports.retrieveDocuments = async (req, res) => {
  const { userId } = req.body;

  console.log("Received request to retrieve documents for userId:", userId);

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);

    const documents = await DocumentModel.find({
      _id: { $in: user.documentIds },
    });

    if (documents.length === 0) {
      console.log("No documents found for userId:", userId);
      return res
        .status(404)
        .json({ message: "No documents found for this user" });
    }

    console.log("Documents retrieved successfully:", documents);

    res
      .status(200)
      .json({
        message: "Documents retrieved successfully",
        documents: documents,
      });
  } catch (error) {
    console.error("Error retrieving documents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

