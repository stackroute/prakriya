const CandidateModel = require('../../models/candidates.js');
const FileModel = require('../../models/files.js');

// let addCadets = function (cadetColln) {
// 	let promise = new Promise
// 	let saveCadet = new CandidateModel(cadetObj)
// 	saveCadet.save(cadetObj, function (err, result) {
// 		if(err)
// 			errorCB(err);
// 		successCB(result);
// 	})
// }

let addCadet = function (cadetObj, successCB, errorCB) {
	let saveCadet = new CandidateModel(cadetObj)
	saveCadet.save(cadetObj, function (err, result) {
		if(err)
			errorCB(err);
		else
			successCB(result);
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