// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var todoSchema = mongoose.Schema({
    user_id: String,
    content: String,
    created_at: Date,
    updated_at: Date,
    finished: Date
});

module.exports = mongoose.model('Todo', todoSchema);
