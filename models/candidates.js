var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var attendance = new Schema({
	DaysPresent: [Date],
	DaysAbsent: [Date]
});

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
		AssetID: String,		
		AssessmentTrack: [String],
		Attendance: attendance
});

module.exports = mongoose.model('Candidates', candidates);