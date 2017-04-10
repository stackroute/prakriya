var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var projects = new Schema({
    name: {type: String, unique: true},
    description: String,
    addedBy: String,
    addedOn: {type: Date, default: Date.now() },
});

module.exports = mongoose.model('Projects', projects);