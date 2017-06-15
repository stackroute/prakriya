const client = require('redis').createClient();
// const client = require('redis').createClient(6379,'redis');
const logger = require('./../../applogger');
const async = require('async');
const uploadMongoController = require('./uploadMongoController');

let registerCandidates = function () {
	client.brpop('fileImport', 0, function (err1, fileId) {
		let importedCadets = [];
		let failedCadets = [];
		let total = 0;
		try {
			uploadMongoController.getFileById(fileId, function (fileObj) {
				let lines = fileObj.data.split('\n');
				let headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
				let cadetColln = [];

				lines.map(function (line, index) {
					if(index > 0 && line !== '') {
					let lineCol = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
						let cadetObj = {};
						headers.map(function (head, key) {
							if(key > 0) {
								if(lineCol[key] !== '') {
									cadetObj[head] = lineCol[key];
								}
							}
						});
						cadetColln.push(cadetObj);
						total = total + 1;
					}
				});

				async.each(cadetColln,
					function (cadetObj, callback) {
						uploadMongoController.addCadet(cadetObj, function (cadet) {
							importedCadets.push(cadet);
							callback();
						}, function (err2) {
							let cadet = {};
							if(err2.name === 'MongoError') {
								cadet.errmsg = 'Duplicate cadet error';
								cadet.eid = cadetObj.EmployeeID;
							} else if(err2.name === 'ValidationError') {
								cadet.errmsg = 'Employee ID is required';
								if(cadetObj.EmailID) {
cadet.eid = cadetObj.EmailID;
} else if(cadetObj.EmployeeName) {
cadet.eid = cadetObj.EmployeeName;
}
							}
							failedCadets.push(cadet);
							callback();
						});
					},
					function (err3) {
						logger.debug('Final function', err3);
						fileObj.totalCadets = total;
						fileObj.importedCadets = importedCadets.length;
						fileObj.failedCadets = failedCadets;
						if(fileObj.totalCadets === fileObj.importedCadets + fileObj.failedCadets.length) {
							uploadMongoController.updateFileStatus(fileObj);
						}
					}
				);
			}, function (err4) {
				logger.error('Error while fetching File Id', err4);
			});
		} catch(err) {
			logger.error(err);
		}
	});
	setTimeout(registerCandidates, 1000);
};

module.exports = {
	registerCandidates: registerCandidates
};
