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
		AssessmentTrack: [assessment],
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
