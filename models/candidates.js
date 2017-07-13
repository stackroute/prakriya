var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var assessment = new Schema({
	AssignmentName : String,
	implementation : String,
	completion: String,
	learning: String
})

var candidates = new Schema({
		EmployeeID: {type: Number, unique: true, required: true},
		EmailID: String,
		DaysPresent: [Date],
		DaysAbsent: [{
			fromDate: {type:Date, unique:true},
			toDate: {type:Date, unique:true},
			approved: String,
			leaveType: String,
			reason: String
		}]
});

module.exports = mongoose.model('Candidates', candidates);
