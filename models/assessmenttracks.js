var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var assessmenttracks = new Schema({
	  Wave: String,
		CourseName: String,
		Categories: [String]
});

module.exports = mongoose.model('AssessmentTracks', assessmenttracks);
