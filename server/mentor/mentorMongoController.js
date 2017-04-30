const CandidateModel = require('../../models/candidates.js');
const AssessmentTrackModel = require('../../models/assessmenttracks.js');

let getTrainingTracks = function(successCB, errorCB) {
	CandidateModel.find().distinct('TrainingTrack', function(err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
}

let getWaves = function(trainingTrack, successCB, errorCB) {
	CandidateModel.find({TrainingTrack: trainingTrack}).distinct('Wave', function(err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
}

let getCourses = function(wave, successCB, errorCB) {
	CandidateModel.find({Wave: wave}).distinct('CourseName', function(err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
}

let getCandidates = function(trainingTrack, wave, course, successCB, errorCB) {
	CandidateModel.find({TrainingTrack: trainingTrack, Wave: wave, CourseName: course}, function(err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
}

let getAssesmentTrack = function(trainingTrack, wave, course, successCB, errorCB) {
	console.log('getAssesmentTrack: ', trainingTrack + ' - ' + wave + ' - ' + course)
	AssessmentTrackModel.findOne({TrainingTrack: trainingTrack, Wave: wave, CourseName: course}, function(err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
}

let updateCandidateAssessment = function (candidateObj, successCB, errorCB) {
	console.log('candidate obj from client side', candidateObj)
	CandidateModel.update({"EmployeeID": candidateObj.EmployeeID}, candidateObj, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

//
// let addAssessmentTrack = function(assessmentTrack, successCB, errorCB) {
// 	console.log('Add AssessmentTrack', assessmentTrack);
// 	let saveAssessmentTrack = new AssessmentTrackModel(assessmentTrack);
// 	saveAssessmentTrack.save(assessmentTrack, function(err, result) {
//
// 	});
// }


// let getTracks
//
//
// let addUser = function(userObj, successCB, errorCB) {
// 	userObj.actions = ['login'];
// 	console.log('Add User', userObj);
// 	let saveUser = new UserModel(userObj)
// 	saveUser.save(userObj, function (err, result) {
// 		if(err)
// 			errorCB(err);
// 		successCB(result);
// 	})
// }
//
// let deleteUser = function (userObj, successCB, errorCB) {
// 	UserModel
// 		.find(userObj)
// 		.remove(function (err, status) {
// 			if(err)
// 				errorCB(err);
// 			successCB(status);
// 		})
// }
//

//
// let lockUser = function (userObj, successCB, errorCB) {
// 	console.log('User obj from server', userObj)
// 	console.log(userObj.username)
// 	UserModel.update({"username": userObj.username}, {$pull:{"actions": "login"}}, function(err, status) {
// 		if(err)
// 			errorCB(err);
// 		successCB(status);
// 	})
// }
//
// let unlockUser = function (userObj, successCB, errorCB) {
// 	console.log('User obj from server', userObj)
// 	console.log(userObj.username)
// 	UserModel.update({"username": userObj.username}, {$push:{"actions": "login"}}, function(err, status) {
// 		if(err)
// 			errorCB(err);
// 		successCB(status);
// 	})
// }
//
// let getRoles = function(successCB, errorCB) {
// 	RoleModel.find({name: {$ne: 'admin'}},function(err, result) {
// 		if (err)
// 				errorCB(err);
// 		successCB(result);
// 	});
// }
//
// let addRole = function (roleObj, successCB, errorCB) {
// 	let saveRole = new RoleModel(roleObj)
// 	saveRole.save(roleObj, function (err, result) {
// 		if(err)
// 			errorCB(err);
// 		successCB(result);
// 	})
// }
//
// let updateRole = function (roleObj, successCB, errorCB) {
// 	console.log('Role obj in Mongo', roleObj)
// 	console.log(roleObj.name)
// 	roleObj.lastModified= new Date();
// 	RoleModel.update({"name": roleObj.name}, roleObj, function(err, status) {
// 		if(err)
// 			errorCB(err);
// 		successCB(status);
// 	})
// }
//
// let deleteRole = function (roleObj, successCB, errorCB) {
// 	RoleModel
// 		.find(roleObj)
// 		.remove(function (err, status) {
// 			if(err)
// 				errorCB(err);
// 			successCB(status);
// 		})
// }
//
// let getAccessControls = function(successCB, errorCB) {
// 	AccessControlModel.find({},function(err, result) {
// 		if (err)
// 				errorCB(err);
// 		successCB(result);
// 	});
// }

module.exports = {
	getWaves,
	getTrainingTracks,
	getCourses,
	getCandidates,
	getAssesmentTrack,
	updateCandidateAssessment
}
