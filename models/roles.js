var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var roles = new Schema({
    role: {type: String, unique: true},
    permisssions: [String]
});

module.exports = mongoose.model('Roles', roles);