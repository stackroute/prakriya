const adminMongoController = require('../admin/adminMongoController');
const CandidateModel = require('../../models/candidates.js');
const FileModel = require('../../models/files.js');
const UserModel = require('../../models/users.js');

let addCadet = function (cadetObj, successCB, errorCB) {
	let saveCadet = new CandidateModel(cadetObj)
	saveCadet.save(cadetObj, function (err, result) {
		if(err)
			errorCB(err);
		else {
			let user = {};
			user.name = cadetObj.EmployeeName;
			user.email = cadetObj.EmailID;
			user.username = cadetObj.EmailID.split('@')[0];
			user.password = 'digital@123';
			user.role = 'candidate';
			adminMongoController.addUser(user, function (user) {
				successCB(result);
			}, function (err) {
				errorCB(err);
			})
		}
	})
}

let addFile = function(fileObj, successCB, errorCB) {
	let saveFile = new FileModel(fileObj)
	saveFile.save(fileObj, function(err, result) {
		if(err)
			errorCB(err);
		successCB(result);
	})
}

let getFileById = function(fileId, successCB, errorCB) {
	FileModel.findOne({'fileId': fileId}, function (err, fileObj) {
		if(err)
			errorCB(err);
		successCB(fileObj);
	})
}

let updateFileStatus = function (fileObj) {
	fileObj.completedOn = Date.now();
	fileObj.status = 'completed';
	FileModel.update({"fileId": fileObj.fileId}, fileObj, function(err, status) {
		if(err)
			console.log(err);
		console.log(status);
	})
}

module.exports = {
	addCadet: addCadet,
	addFile: addFile,
	getFileById: getFileById,
	updateFileStatus: updateFileStatus
}