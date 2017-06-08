const async = require('async');
const RoleModel = require('../../models/roles.js');
const WaveModel = require('../../models/waves.js');
const ProjectModel = require('../../models/projects.js');
const CandidateModel = require('../../models/candidates.js');
const FileModel = require('../../models/files.js');
const FeedbackModel = require('../../models/feedback.js');
const EvaluationModel = require('../../models/evaluation.js');
const CourseModel = require('../../models/courses.js');
const adminMongoController = require('../admin/adminMongoController.js');
const UserModel = require('../../models/users.js');
const CONFIG = require('../../config');
const logger = require('./../../applogger');


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

let updateLastLogin = function(user, successCB, errorCB) {
	UserModel.update({username: user.username}, {$set: {lastLogin: user.lastLogin}}, function(err, result) {
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
	let userObj = {};
	let saveWave = new WaveModel(waveObj);
	saveWave.save(function (err, result) {
		if(err)
			errorCB(err);
		else {
			async.each(result.Cadets,
			  function(cadetID, callback){
			    CandidateModel.findOneAndUpdate({"EmployeeID": cadetID}, {$set: {"Wave": result.WaveID}}, function(err, user) {
						if(err)
							errorCB(err);
						else
						{
							userObj.name = user.EmployeeName;
							userObj.email = user.EmailID;
							userObj.username = user.EmailID.split('@')[0];
							userObj.password = CONFIG.DEFAULT_PASS;
							userObj.role = 'candidate';
							adminMongoController.addUser(userObj, function (savedUser) {
								logger.info('User created', user.EmployeeName);
								callback();
							}, function (err) {
								logger.error('Error in creating user', err)
							})
						}
					})
			  },
			  function(err){
			  	successCB(result);
			  }
			);
		}
	})
}

let getWave = function (waveID, successCB, errorCB) {
	logger.debug('In get Wave', waveID)
	WaveModel.findOne({WaveID: waveID}, function (err, result) {
		if(err)
			errorCB(err);
		successCB(result);
	})
}
let getActiveWaves = function(successCB, errorCB) {
	let today = new Date()
	WaveModel.aggregate(
		{$match: {$and: [{'StartDate': {$lte: today}}, {'EndDate': {$gte: today}}]}},
		{ $project: { _id: 0, 'WaveID': 1 }},
		function(err, result) {
			if (err) {
					console.log('Date Error: ', err)
					errorCB(err);
			}
			// change successCB for an empty result array -- !to_be_done
			successCB(result.map(function(obj) {return obj.WaveID}));
		}
	);
}


/****************************************************
*******              Projects                ********
****************************************************/

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
		else
		{
			projectObj.members.map(function(member) {
				CandidateModel.update({EmployeeID:member.EmployeeID},{$set:{ProjectName: projectObj.name,ProjectDescription: projectObj.description,ProjectSkills: projectObj.skills}},function(err,result){
					if(err)
						errorCB(err)
					console.log(result);
				})
			},
					successCB(result))
		}
	})
}

let updateProject = function (projectObj,delList, prevWave, successCB, errorCB) {
	console.log(prevWave)
	ProjectModel.update({name:projectObj.name},projectObj,function (err, result) {
		if(err)
			errorCB(err);
		else
		{
			projectObj.members.map(function(member) {
				CandidateModel.update({EmployeeID:member.EmployeeID},{$set:{ProjectName: projectObj.name,ProjectDescription: projectObj.description,ProjectSkills: projectObj.skills}},function(err,result){
					if(err)
						errorCB(err)
					console.log(result);
				})
			},
			CandidateModel.updateMany({EmployeeID:{$in:delList}},{$set:{ProjectName: '',ProjectDescription: '',ProjectSkills: []}},function(err,result){
					if(err)
						errorCB(err)
					console.log(result)
				},CandidateModel.updateMany({$and:[{ProjectName:projectObj.name},{Wave:prevWave}]},{$set:{ProjectName: '',ProjectDescription: '',ProjectSkills: []}},function(err,result){
					if(err)
						errorCB(err)
					successCB(result)
				})
				)
			)
		}
	});
}

let deleteProject = function (projectObj, successCB, errorCB) {
	ProjectModel.remove({name:projectObj.name},function (err, result) {
		if(err)
			errorCB(err);
		else
		{
			CandidateModel.updateMany({ProjectName:projectObj.name},{$set:{ProjectName: '',ProjectDescription: '',ProjectSkills: []}},function(err,result){
					if(err)
						errorCB(err)
					console.log(result)
					successCB(result)
				})
		}
	})
}

let getCadetsOfProj = function(name, successCB, errorCB) {
	CandidateModel.find({ProjectName:name},function(err, result) {
		if (err)
				errorCB(err);
		successCB(result);
	});
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

let updateCadets = function (cadetArr, successCB, errorCB) {
	let count = 0;
	cadetArr.forEach(function(cadetObj) {
		CandidateModel.update({"EmployeeID": cadetObj.EmployeeID}, cadetObj, function(err, status) {
			if(err)
				errorCB(err);
			count++;
			if(count == cadetArr.length) 
				successCB(status);
		})
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
		      WaveModel.update({Cadets:cadetObj.EmployeeID},{$pull:{Cadets:cadetObj.EmployeeID}},function (err, result) {
		      	if(err)
		      		errorCB(err)
		      	else {
		      		ProjectModel.update({members:{$elemMatch:{"EmployeeID" : cadetObj.EmployeeID}}},{$pull:{members:{"EmployeeID" : cadetObj.EmployeeID}}},function (err, result) {
		      			if(err)
				      		errorCB(err)
					      	successCB(result)
					      })

		      	}
		      })
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
	CandidateModel.find({Wave: waveID}, function(err, result) {
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
	CandidateModel.updateMany({EmployeeID:{$in:AbsenteesID.absentees}},{$push:{'Attendance.DaysAbsent':AbsenteesID.date}}, function(err, result) {
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

let getAssesmentTrack = function(courseName, successCB, errorCB) {
	CourseModel.findOne({CourseName: courseName}, 'AssessmentCategories', function(err, result) {
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

let getWaves = function(successCB, errorCB) {
	WaveModel.find({},function(err, result) {
		if (err)
				errorCB(err);
			console.log(result);
		successCB(result);
	});
}

let getCadetsOfWave = function(cadets, successCB, errorCB) {
	CandidateModel.find({EmployeeID:{$in: cadets}},function(err, result) {
		if (err)
				errorCB(err);
			console.log(result);
		successCB(result);
	});
}

let deleteWave = function (waveObj, successCB, errorCB) {
	WaveModel.remove({WaveID:waveObj.WaveID},function (err, result) {
		if(err)
			errorCB(err);
		else
		{
			CandidateModel.find({EmployeeID:{$in:waveObj.Cadets}},function(err, cadets){
				cadets.map(function(cadetObj){
				let user = {};
				user.name = cadetObj.EmployeeName;
				user.email = cadetObj.EmailID;
				user.username = cadetObj.EmailID.split('@')[0];
				adminMongoController.deleteUser(user, function (status) {
		 				if(err)
		 					console.log(err)
		 				console.log("..........."+status)
		    })
		    });
			},
				CandidateModel.updateMany({EmployeeID:{$in:waveObj.Cadets}},{$set:{Wave:undefined}},function(err,res){
					if(err)
						console.log(err)
					successCB(result);
				})
			)
		}
	})
}

let updateWave = function (waveObj, successCB, errorCB) {
	WaveModel.update({WaveID:waveObj.WaveID},waveObj,function (err, result) {
		if(err)
			errorCB(err);
		successCB(result)
	})
}

let updateCadetWave = function (cadets, waveID, successCB, errorCB) {
	let userObj = {};
	cadets.map(function(cadet){
	CandidateModel.findOneAndUpdate({"EmployeeID": cadet}, {$set: {"Wave": waveID}}, function(err, user) {
						if(err)
							errorCB(err);
						else
						{
							userObj.name = user.EmployeeName;
							userObj.email = user.EmailID;
							userObj.username = user.EmailID.split('@')[0];
							userObj.password = CONFIG.DEFAULT_PASS;
							userObj.role = 'candidate';
							adminMongoController.addUser(userObj, function (savedUser) {
								logger.info('User created', user.EmployeeName);
							}, function (err) {
								logger.error('Error in creating user', err)
							})
						}
					})
				})
}

module.exports = {
	updateLastLogin,
	getPermissions,
	addWave,
	getWave,
	getCadet,
	getCadets,
	getProjects,
	addProject,
	deleteProject,
	updateProject,
	getFiles,
	updateCadet,
	updateCadets,
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
	getNotifications,
	getWaves,
	getCadetsOfWave,
	deleteWave,
	getActiveWaves,
	updateWave,
	getCadetsOfProj,
	updateCadetWave
}
