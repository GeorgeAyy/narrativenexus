const {Schema, model} = require('mongoose');

const Document = new Schema({
    _id: String,
    data: Object // what ever qull sends us
})

module.exports = model('Document', Document) // export the model