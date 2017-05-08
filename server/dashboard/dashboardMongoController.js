const RoleModel = require('../../models/roles.js');
const WaveModel = require('../../models/waves.js');
const ProjectModel = require('../../models/projects.js');
const CandidateModel = require('../../models/candidates.js');
const FileModel = require('../../models/files.js');
const FeedbackModel = require('../../models/feedback.js');
const EvaluationModel = require('../../models/evaluation.js');
const adminMongoController = require('../admin/adminMongoController.js');
const WaveModel = require('../../models/waves.js');

let getPermissions =  function(role, successCB, errorCB) {
	RoleModel.findOne({"name": role},function(err, result) {
		if (err) {
			errorCB(err);
		}
		successCB(result);
	});
}

let addWave = function (waveObj, successCB, errorCB) {
	console.log('WaveObj', waveObj)
	let saveWave = new WaveModel(waveObj);
	saveWave.save(function (err, result) {
		if(err)
			errorCB(err);
		result.Cadets.map(function(cadetID) {
			CandidateModel.update({"EmployeeID": cadetID}, {$set: {"Wave": result.WaveID}}, function(err, status) {
				if(err)
					errorCB(err);
			})
		})
		successCB(result);
	})
}

let getProjects = function(successCB, errorCB) {
	ProjectModel.find({},function(err, result) {
		if (err)
				errorCB(err);
		successCB(result);
	});
}

let addProject = function (projectObj, successCB, errorCB) {
	let saveProject = new ProjectModel(projectObj);
	saveProject.save(function (err, result) {
		if(err)
			errorCB(err);
		successCB(result)
	})
}

let getCadet = function(email, successCB, errorCB) {
	console.log();
	CandidateModel.findOne({'EmailID': email},function(err, result) {
		if (err)
				errorCB(err);
		successCB(result);
	});
}

let getCadets = function(successCB, errorCB) {
	CandidateModel.find({},function(err, result) {
		if (err)
				errorCB(err);
		successCB(result);
	});
}

let updateCadet = function (cadetObj, successCB, errorCB) {
	console.log('CadetObj to update', cadetObj)
	CandidateModel.update({"EmployeeID": cadetObj.EmployeeID}, cadetObj, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

let deleteCadet = function(cadetObj, successCB, errorCB) {
	console.log('cadetObj to delete', cadetObj)
	CandidateModel
		.find(cadetObj)
		.remove(function (err, status) {
			if(err)
				errorCB(err);
			else {
				let user = {};
				user.name = cadetObj.EmployeeName;
				user.email = cadetObj.EmailID;
				user.username = cadetObj.EmailID.split('@')[0];
				adminMongoController.deleteUser(user, function (status) {
		      successCB(status)
		    }, function (err) {
		      errorCB(err);
		    })
			}
		})
}

let getFiles = function(successCB, errorCB) {
	FileModel.find({},function(err, result) {
		if (err)
				errorCB(err);
		successCB(result);
	});
}

let saveFeedback = function(feedbackObj, successCB, errorCB) {
	let saveFeedbackObj = new FeedbackModel(feedbackObj);
	saveFeedbackObj.save(function (err, result) {
		console.log(err);
		if(err)
			errorCB(err);
		successCB(result);
	})
}

let saveEvaluation = function(evaluationObj, successCB, errorCB) {
	let saveEvaluationObj = new EvaluationModel(evaluationObj);
	saveEvaluationObj.save(function (err, result) {
		console.log(err);
		if(err)
			errorCB(err);
		successCB(result);
	})
}


/****************************************************
*******          Attendance         ********
****************************************************/
let getWaveId = function(successCB, errorCB) {
	console.log("insidemongo controller")
	WaveModel.find().distinct('WaveID', function(err, result) {
		if(err) {
			console.log("error")
			errorCB(err);
		}
		successCB(result);
	});
}
//get all candidates of specific wave
let getWaveSpecificCandidates = function(WaveID,successCB, errorCB) {
	console.log("insidemongo controller"+WaveID)
	CandidateModel.find({Wave:WaveID},'EmployeeName', function(err, result) {
		if(err) {
			console.log("error")
			errorCB(err);
		}
		console.log(result);
		successCB(result);
	});
}

//update absentees
let updateAbsentees = function(AbsenteesID,successCB, errorCB) {
	console.log("absentees"+AbsenteesID.absentees);
	CandidateModel.update({EmployeeName:{$in:AbsenteesID.absentees}},{$push:{'Attendance.DaysAbsent':AbsenteesID.date}}, function(err, result) {
		if(err) {
			console.log("error"+err)
			errorCB(err);
		}
		console.log(result);
		successCB(result);
	});
}

module.exports = {
	getPermissions: getPermissions,
	addWave: addWave,
	getCadet: getCadet,
	getCadets: getCadets,
	getProjects: getProjects,
	addProject: addProject,
	getFiles: getFiles,
	updateCadet: updateCadet,
	deleteCadet: deleteCadet,
	saveFeedback: saveFeedback,
	saveEvaluation: saveEvaluation,
	getWaveId,
	getWaveSpecificCandidates,
	updateAbsentees
}
