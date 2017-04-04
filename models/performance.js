var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var performance = new Schema({
	employeeID: {type: Number, unique: true},
	employeeName: String,
	emailID: String,
	skills: [
		{
			name: String,
			expected: Number,
			actual: Number,
			remarks: String
		}
	]
});

module.exports = mongoose.model('Performance', performance);