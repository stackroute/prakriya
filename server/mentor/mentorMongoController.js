const CandidateModel = require('../../models/candidates.js');
const CourseModel = require('../../models/courses.js');
const WaveModel = require('../../models/waves.js');
const logger = require('./../../applogger');

/** ************************************************
*******          AssessmentTrack           ********
***************************************************/

let updateCandidateAssessment = function (candidateObj, successCB, errorCB) {
	logger.info('candidate obj from client side', candidateObj);
	CandidateModel.
		update({EmployeeID: candidateObj.EmployeeID},
		candidateObj,
		function (err, status) {
		if(err) {
				errorCB(err);
		}
		successCB(status);
	});
};

/** **************************************************
*******          Course Management           ********
****************************************************/


let getCourses = function (successCB, errorCB) {
	CourseModel.find({}, function (err, result) {
		if (err) {
			errorCB(err);
		}
		successCB(result);
	});
};

let getCourse = function (Course, successCB, errorCB) {
	CourseModel.find({ID: Course}, function (err, result) {
		if (err) {
errorCB(err);
}
		successCB(result);
	});
}

let updateCourse = function (CourseObj, successCB, errorCB) {
	CourseModel.
	update({ID: CourseObj.ID},
		{$set: CourseObj
		},
		function (err, status) {
			if(err) {
				errorCB(err);
			}
		successCB(status);
	});
};

let addCourse = function (CourseObj, successCB, errorCB) {
	logger.info(CourseObj);
	let CourseModelObj = new CourseModel(CourseObj);
	CourseModelObj.save(function (err, status) {
		if(err) {
			errorCB(err);
		}
		successCB(status);
	});
};

let deleteCourse = function (courseObj, successCB, errorCB) {
	CourseModel.
	update({ID: courseObj.ID}, {$set: {Removed: true}}, function (err, status) {
		if(err) {
			errorCB(err);
		}
		successCB(status);
	});
};

let restoreCourse = function (restoreObj, successCB, errorCB) {
	CourseModel.
	updateMany({ID: {$in: restoreObj}}, {$set: {Removed: false}}, function (err, status) {
		if(err) {
			errorCB(err);
		}
		successCB(status);
	});
};

let addCategory = function (object, successCB, errorCB) {
	let categoryObj = object.Categories;
	CourseModel.
	update({CourseID: object.CourseID},
		{
			$set: {History: object.History},
			$push: {Categories:
				{
					Name: categoryObj.Name,
					Mentor: categoryObj.Mentor,
					Duration: categoryObj.Duration,
					Videos: categoryObj.Videos,
					Blogs: categoryObj.Blogs,
					Docs: categoryObj.Docs
				}
			}
		},
		function (err, status) {
			if(err) {
				errorCB(err);
			}
			successCB(status);
		});
};

let deleteCategory = function (object, successCB, errorCB) {
	let categoryObj = object.Categories;
	CourseModel.
	update(
		{CourseID: object.CourseID},
		{$set:
			{History: object.History},
			$pull: {Categories:
				{
					Name: categoryObj.Name,
					Mentor: categoryObj.Mentor,
					Duration: categoryObj.Duration,
					Videos: categoryObj.Videos,
					Blogs: categoryObj.Blogs,
					Docs: categoryObj.Docs
				}
			}
		},
		function (err, status) {
			if(err) {
				errorCB(err);
			}
			successCB(status);
		}
	);
};

/** *********************************************
*******          Program Flow           ********
***********************************************/

let getWaveObject = function (trainingTrack, waveNumber, successCB, errorCB) {
	WaveModel.findOne({TrainingTrack: trainingTrack, WaveNumber: waveNumber}, function (err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
};

let addNewSession = function (object, successCB, errorCB) {
	let timeStamp = new Date().getTime();
	logger.info('addNewSession: ' + JSON.stringify(object));
	WaveModel.findOneAndUpdate(
		{WaveID: object.waveID},
		{$push:
			{Sessions:
				{
					SessionID: timeStamp,
					CourseName: object.session.CourseName,
					Week: object.session.Week,
					Activities: object.session.Activities,
					Status: object.session.Status,
					ContextSetSession: object.session.ContextSetSession,
					SessionBy: object.session.SessionBy,
					SessionOn: object.session.SessionOn,
					Remarks: object.session.Remarks
				}
			}
		}, function (err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
};

let updateSession = function (object, successCB, errorCB) {
	logger.info('updateSession: ', JSON.stringify(object));
	WaveModel.findOneAndUpdate(
		{
			WaveID: object.waveID,
			'Sessions.SessionID': object.session.SessionID
		},
		{
			$set: {
				'Sessions.$': object.session
			}
		}, function (err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
};

let deleteSession = function (object, successCB, errorCB) {
	logger.info('deleteSession: ', JSON.stringify(object));
	WaveModel.update(
		{
			WaveID: object.waveID,
			'Sessions.SessionID': object.session.SessionID
		},
		{
			$pull: {
				Sessions: object.session
			}
		}, function (err, result) {
		if(err) {
			errorCB(err);
		}
		successCB(result);
	});
};

module.exports = {
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
	updateSession,
	deleteSession,
	getCourse
};
