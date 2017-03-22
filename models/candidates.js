var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var candidates = new Schema({
		eid: Number,
		name: String,
		email: String,
    username: {type: String, unique: true},
    password: String,
    role: String,
    actions: [String]
});

module.exports = mongoose.model('Candidates', candidates);