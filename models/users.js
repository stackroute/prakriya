var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var users = new Schema({
		name: String,
		email: String,
    username: {type: String, unique: true},
    password: String,
    role: String,
    lastLogin: Date,
    actions: [String],
		notifications: [String],
		DaysPresent: [Date],
		DaysAbsent: [{
			fromDate: {type:Date, unique:true},
			toDate: {type:Date, unique:true},
			approved: String,
			leaveType: String,
			reason: String
		}]
});

module.exports = mongoose.model('Users', users);
