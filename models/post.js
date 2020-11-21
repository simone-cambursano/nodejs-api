const mongoose = require('mongoose');

const Schema = mongoose.Schema; //extract schema constructor from the mongoose object

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: true
    }
}, {timestamps: true}); //timestamps option appends automatically the date of the creation of the object

module.exports = mongoose.model('Post', postSchema); //export a mongoose model named Post based on postSchema schema. Also monggose will create a collection named Post in the db when starting using this model