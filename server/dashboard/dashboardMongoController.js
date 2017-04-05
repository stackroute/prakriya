const RoleModel = require('../../models/roles.js');
const CandidateModel = require('../../models/candidates.js');
const FileModel = require('../../models/files.js');
const adminMongoController = require('../admin/adminMongoController.js');

let getPermissions =  function(role, successCB, errorCB) {
	RoleModel.findOne({"role": role},function(err, result) {
		if (err) {
			errorCB(err);
		}
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

module.exports = {
	getPermissions: getPermissions,
	getCadets: getCadets,
	getFiles: getFiles,
	updateCadet: updateCadet,
	deleteCadet: deleteCadet
}