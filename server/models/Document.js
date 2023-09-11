const { Schema, model } = require('mongoose');

const Document = new Schema({
  _id: String,
  name: String,
  data: Object, // whatever content your document holds
  owner: {
    type: String,
    required: true,
  },
  collaborators: [{
    type: String,
  }],
  hasControl: String
});

module.exports = model('Document', Document);
