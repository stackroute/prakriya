var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var candidates = new Schema({
		EmployeeID: {type: Number, unique: true},
		EmployeeName: String,
		EmailID: String,
		AltEmail: String,
		Contact: Number,
		DigiThonQualified: String,
		Selected: String,
		Remarks: String,
		CareerBand: String,
		RevisedBU: String,
		DigiThonPhase: Number,
		DigiThonScore: Number,
		TrainingStatus: String,
		TrainingsUndergone: String,
		WorkExperience: String,
		MentorTrack: String,
		Wave: String,
		CourseName: String,
		AcademyTrainingSkills: String,
		CostCenter: String,
		PrimarySupervisor: String,
		ProjectSupervisor: String,
		College: String,
		CGPA: String,
		Date: String,
		ProjectName: String,
		ProjectDescription: String,
		ProjectSkills: [String],
		AssetID: String,
		AssessmentTrack: [String],
		DaysPresent: [Date],
		DaysAbsent: [{
			fromDate: Date,
			toDate: Date,
			approved: String,
			leaveType: String,
			reason: String
		}]
});

module.exports = mongoose.model('Candidates', candidates);
