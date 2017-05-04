const CandidateModel = require('../../models/candidates.js');
const AssessmentTrackModel = require('../../models/assessmenttracks.js');
const CourseModel = require('../../models/courses.js');
const WaveModel = require('../../models/waves.js');

/**************************************************
*******          AssessmentTrack           ********
***************************************************/

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

let getCoursesFrom = function(wave, successCB, errorCB) {
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

/****************************************************
*******          Course Management           ********
****************************************************/


let getCourses = function(successCB, errorCB) {
	CourseModel.find({},function(err, result) {
		if (err)
				errorCB(err);
		successCB(result);
	});
}

let updateCourse = function (CourseObj, successCB, errorCB) {
	console.log('Course obj from server', CourseObj)
	console.log(CourseObj.CourseName)
	CourseModel.update({"CourseID": CourseObj.CourseID}, {$set:{'CourseName':CourseObj.CourseName,'AssessmentCategories':CourseObj.AssessmentCategories,'Duration':CourseObj.Duration}}, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

let addCourse = function (CourseObj, successCB, errorCB) {
	console.log(CourseObj);
	let CourseModelObj = new CourseModel(CourseObj);
	CourseModelObj.save(function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

let deleteCourse = function(courseObj, successCB, errorCB) {
	console.log('cadetObj to delete', courseObj);
	CourseModel.update({'CourseID':courseObj.CourseID},{$set:{'Removed':true}}, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

let restoreCourse = function(restoreObj, successCB, errorCB) {
	console.log('restoreObj', restoreObj.length);
	CourseModel.updateMany({CourseName:{$in:restoreObj}},{$set:{'Removed':false}}, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

let addCategory = function(categoryObj, successCB, errorCB) {
	CourseModel.update({'CourseID':categoryObj.CourseID},{$push:{'Categories':{'Name':categoryObj.Name,'Mentor':categoryObj.Mentor,'Duration':categoryObj.Duration,'Videos':categoryObj.Videos,'Blogs':categoryObj.Blogs,'Docs':categoryObj.Docs}}}, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

let deleteCategory = function(categoryObj, successCB, errorCB) {
	CourseModel.update({'CourseID':categoryObj.CourseID},{$pull:{'Categories':{'Name':categoryObj.Name,'Mentor':categoryObj.Mentor,'Duration':categoryObj.Duration,'Videos':categoryObj.Videos,'Blogs':categoryObj.Blogs,'Docs':categoryObj.Docs}}}, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

/***********************************************
*******          Program Flow           ********
***********************************************/

let getWaveObject = function(trainingTrack, waveNumber, successCB, errorCB) {
	WaveModel.findOne({TrainingTrack: trainingTrack, WaveNumber: waveNumber}, function(err, result) {
		if(err) {
			errorCB(err)
		}
		successCB(result)
	});
}

let addNewSession = function(object, successCB, errorCB) {
	let timeStamp = new Date().getTime()
	console.log('addNewSession: '+ JSON.stringify(object))
	WaveModel.findOneAndUpdate(
		{'WaveID': object.waveID},
		{'$push':
			{'Sessions':
				{
					'SessionID': timeStamp,
				  'CourseName': object.session.CourseName,
				  'Week': object.session.Week,
				  'Activities': object.session.Activities,
				  'Status': object.session.Status,
				  'ContextSetSession': object.session.ContextSetSession,
				  'SessionBy': object.session.SessionBy,
				  'SessionOn': object.session.SessionOn,
				  'Remarks': object.session.Remarks
				}
			}
		}, function(err, result) {
		if(err) {
			errorCB(err)
		}
		successCB(result)
	})
}

let updateSession = function(object, successCB, errorCB) {
	console.log('updateSession: ', JSON.stringify(object))
	WaveModel.findOneAndUpdate(
		{
			'WaveID': object.waveID,
			'Sessions.SessionID': object.session.SessionID
		},
		{
			'$set': {
				'Sessions.$': object.session
			}
		}, function(err, result) {
		if(err) {
			errorCB(err)
		}
		successCB(result)
	})
}

module.exports = {
	getWaves,
	getTrainingTracks,
	getCoursesFrom,
	getCandidates,
	getAssesmentTrack,
	updateCandidateAssessment,
	getCourses,
	updateCourse,
	deleteCourse,
	restoreCourse,
	addCategory,
	deleteCategory,
	addCourse,
	getWaveObject,
	addNewSession,
	updateSession
}
