const RoleModel = require('../../models/roles.js');
const ProjectModel = require('../../models/projects.js');
const CandidateModel = require('../../models/candidates.js');
const FileModel = require('../../models/files.js');
const FeedbackModel = require('../../models/feedback.js');
const EvaluationModel = require('../../models/evaluation.js');
const adminMongoController = require('../admin/adminMongoController.js');
const CourseModel = require('../../models/courses.js');

let getPermissions =  function(role, successCB, errorCB) {
	RoleModel.findOne({"name": role},function(err, result) {
		if (err) {
			errorCB(err);
		}
		successCB(result);
	});
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
		successCB(result);
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
	CourseModel.update({'CourseID':categoryObj.CourseID},{$push:{'Categories':{'Name':categoryObj.Name,'Mentor':categoryObj.Mentor,'Duration':categoryObj.Duration,'Videos':categoryObj.Videos,'Blogs':categoryObj.Blogs,'Docs':categoryObj.Blogs}}}, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

let deleteCategory = function(categoryObj, successCB, errorCB) {
	CourseModel.update({'CourseID':categoryObj.CourseID},{$pull:{'Categories':{'Name':categoryObj.Name,'Mentor':categoryObj.Mentor,'Duration':categoryObj.Duration,'Videos':categoryObj.Videos,'Blogs':categoryObj.Blogs,'Docs':categoryObj.Blogs}}}, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

module.exports = {
	getPermissions: getPermissions,
	getCadet: getCadet,
	getCadets: getCadets,
	getProjects: getProjects,
	addProject: addProject,
	getFiles: getFiles,
	updateCadet: updateCadet,
	deleteCadet: deleteCadet,
	saveFeedback: saveFeedback,
	saveEvaluation: saveEvaluation,
	getCourses: getCourses,
	updateCourse : updateCourse,
	deleteCourse: deleteCourse,
	restoreCourse: restoreCourse,
	addCategory: addCategory,
	deleteCategory: deleteCategory
}