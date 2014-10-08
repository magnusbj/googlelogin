// load the things we need
var mongoose = require('mongoose');

// define the schema for event database
var eventSchema = mongoose.Schema({
    summary: String,
    start: Date,
    end: {type: Date}
})

module.exports = mongoose.model('Event', eventSchema);
