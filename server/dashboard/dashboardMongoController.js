const RoleModel = require('../../models/roles.js');
const WaveModel = require('../../models/waves.js');
const ProjectModel = require('../../models/projects.js');
const CandidateModel = require('../../models/candidates.js');
const FileModel = require('../../models/files.js');
const FeedbackModel = require('../../models/feedback.js');
const EvaluationModel = require('../../models/evaluation.js');
const AssessmentTrackModel = require('../../models/assessmenttracks.js');
const adminMongoController = require('../admin/adminMongoController.js');
const UserModel = require('../../models/users.js');


/****************************************************
*******          Notification System         ********
****************************************************/

// Adding a new notification
let addNotification = function(email, message, successCB, errorCB) {
	console.log('adding notification: ', email, ' -- ', message)
	UserModel.update({email: email}, {$push: {notifications: message}}, function(err, result){
		if(err) {
			errorCB(err);
		}
		console.log('add results: ', result);
		successCB(result);
	})
}

// Deleting a new notification
let deleteNotification = function(email, message, successCB, errorCB) {
	console.log('Deleting notification: ', email, ' -- ', message)
	UserModel.update({email: email}, {$pull: {notifications: message}}, function(err, result){
		if(err) {
			errorCB(err);
		}
		console.log(result);
		successCB(result);
	})
}

// Getting all notifications
let getNotifications = function(username, successCB, errorCB) {
	UserModel.findOne({username: username}, 'notifications', function(err, result){
		if(err) {
			errorCB(err);
		}
		console.log(result);
		successCB(result);
	})
}

let changePassword = function(user, successCB, errorCB) {
	UserModel.update({username: user.username}, {$set: {password: user.password}}, function(err, result){
		if(err) {
			errorCB(err);
		}
		console.log(result);
		successCB(result);
	})
}
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
	let user = {};
	let saveWave = new WaveModel(waveObj);
	saveWave.save(function (err, result) {
		if(err)
			errorCB(err);
		console.log(result);
		result.Cadets.map(function(cadetID) {
			CandidateModel.findOneAndUpdate({"EmployeeID": cadetID}, {$set: {"Wave": result.WaveID}}, function(err, status) {
				if(err)
					errorCB(err);
				else
				{
					console.log(status.EmployeeName);
					user.name = status.EmployeeName;
					user.email = status.EmailID;
					user.username = status.EmailID.split('@')[0];
					user.password = 'digital@123';
					user.role = 'candidate';
					adminMongoController.addUser(user, function (user) {
						console.log('SuccessCB')
					}, function (err) {
						console.log('ErrorCB')
					})
				}
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

let updateProject = function (projectObj, successCB, errorCB) {
	ProjectModel.update({name:projectObj.name},projectObj,function (err, result) {
		if(err)
			errorCB(err);
		successCB(result)
	})
}

let deleteProject = function (projectObj, successCB, errorCB) {
	ProjectModel.remove({name:projectObj.name},function (err, result) {
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

//get all candidates of specific wave
let getWaveSpecificCandidates = function(waveID,successCB, errorCB) {
	console.log("insidemongo controller"+waveID)
	CandidateModel.find({Wave: waveID},['EmployeeID','EmployeeName'], function(err, result) {
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
	CandidateModel.update({EmployeeID:{$in:AbsenteesID.absentees}},{$push:{'Attendance.DaysAbsent':AbsenteesID.date}}, function(err, result) {
		if(err) {
			console.log("error"+err)
			errorCB(err);
		}
		console.log(result);
		successCB(result);
	});
}

/****************************************************
*******          Candidates                 ********
****************************************************/

let saveCandidate = function(candidate,successCB, errorCB) {
	let newCadet = new CandidateModel(candidate);
	newCadet.save(function (err, result) {
		if(err)
			errorCB(err);
		successCB(result)
	});
}

let getCoursesForWave = function(waveID, successCB, errorCB) {
	console.log('getCoursesForWave: ', waveID)
	WaveModel.findOne({WaveID: waveID}, 'CourseNames' , function(err, result) {
		if(err)
			errorCB(err)
		console.log('Result for getCoursesForWave: ', result);
		successCB(result);
	});
}

let getCandidates = function(waveID, courseName, successCB, errorCB) {
	CandidateModel.find({Wave: waveID, CourseName: courseName}, function(err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
}

let getAssesmentTrack = function(waveID, courseName, successCB, errorCB) {
	console.log('getAssesmentTrack: ', + waveID + ' - ' + courseName)
	AssessmentTrackModel.findOne({Wave: waveID, CourseName: courseName}, function(err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
}

/****************************************************
*******             Common Functions         ********
****************************************************/

let getWaveIDs = function(successCB, errorCB) {
	WaveModel.find().distinct('WaveID', function(err, result) {
		if(err) {
			console.log("error")
			errorCB(err);
		}
		successCB(result);
	});
}

let getWaveObject = function(waveID, successCB, errorCB) {
	WaveModel.findOne({WaveID: waveID}, function(err, result) {
		if(err) {
			console.log("error")
			errorCB(err);
		}
		successCB(result);
	});
}

module.exports = {
	getPermissions,
	addWave,
	getCadet,
	getCadets,
	getProjects,
	addProject,
	deleteProject,
	updateProject,
	getFiles,
	updateCadet,
	deleteCadet,
	saveFeedback,
	saveEvaluation,
	getWaveIDs,
	getWaveSpecificCandidates,
	updateAbsentees,
	saveCandidate,
	getCoursesForWave,
	getCandidates,
	getAssesmentTrack,
	getWaveObject,
	changePassword,
	addNotification,
	deleteNotification,
	getNotifications
}
