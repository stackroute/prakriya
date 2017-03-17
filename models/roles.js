var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roles = new Schema({
    role: {type: String, unique: true},
    permissions: [String]
});

module.exports = mongoose.model('Roles', roles);