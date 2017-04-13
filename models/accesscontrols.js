var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var accesscontrols = new Schema({
    name: {type: String, unique: true},
    code: String
});

module.exports = mongoose.model('AccessControls', accesscontrols);