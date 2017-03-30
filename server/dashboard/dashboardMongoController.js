const RoleModel = require('../../models/roles.js');
const CandidateModel = require('../../models/candidates.js');
const FileModel = require('../../models/files.js');

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
	getFiles: getFiles
}