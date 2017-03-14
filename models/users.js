var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var users = new Schema({
		name: String,
		email: String,
    username: {type: String, unique: true},
    password: String,
    role: String,
    actions: [String]
});

module.exports = mongoose.model('Users', users);