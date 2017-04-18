var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roles = new Schema({
    name: {type: String, unique: true},
    lastModified: {type: Date, default: Date.now() },
    controls: [String]
});

module.exports = mongoose.model('Roles', roles);