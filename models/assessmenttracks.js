var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var assessmenttracks = new Schema({
		TrainingTrack: String,
	  Wave: String,
		CourseName: String,
		Categories: [String]
});

module.exports = mongoose.model('AssessmentTracks', assessmenttracks);
