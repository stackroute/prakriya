const client = require('redis').createClient();
// const client = require('redis').createClient(6379,'redis');
const logger = require('./../../applogger');
const async = require('async');
const uploadMongoController = require('./uploadMongoController');

let registerCandidates = function () {
	client.brpop('fileImport', 0, function(err, fileId) {
		let importedCadets = [], failedCadets = [];
		let total = 0;
		let cadetsFetched = 0;
		try {
			uploadMongoController.getFileById(fileId, function (fileObj) {

				let lines = fileObj.data.split('\n');
			  let headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
			  let cadetColln = [];

			  lines.map(function (line, index) {
			  	if(index > 0 && line != '') {
			  		let line_col = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
			  		let cadetObj = {};
			  		headers.map(function (head, key) {
			  			if(key > 0) {
			  				if(line_col[key] != '')
			  					cadetObj[head] = line_col[key];
			  			}
			  		})
			  		cadetColln.push(cadetObj);
			  		total++;
			  	}
			  })

			  async.each(cadetColln,
				  function(cadetObj, callback){
				    uploadMongoController.addCadet(cadetObj, function (cadet) {
			  			importedCadets.push(cadet);
			  			callback();
			  		}, function (err) {
			  			let cadet = {};
			  			if(err.name == 'MongoError') {
			  				cadet.errmsg = 'Duplicate cadet error';
			  				cadet.eid = cadetObj.EmployeeID;
			  			}
			  			else if(err.name == 'ValidationError') {
			  				cadet.errmsg = 'Employee ID is required'
			  				if(cadetObj.EmailID)
			  					cadet.eid = cadetObj.EmailID;
			  				else if(cadetObj.EmployeeName)
			  					cadet.eid = cadetObj.EmployeeName;
			  			}
			  			failedCadets.push(cadet);
			  			callback();
			  		})
				  },
				  function(err){
				  	logger.debug('Final function');
					  fileObj.totalCadets = total;
					  fileObj.importedCadets = importedCadets.length;
					  fileObj.failedCadets = failedCadets;
					  if(fileObj.totalCadets ==  fileObj.importedCadets+fileObj.failedCadets.length) {
					  	uploadMongoController.updateFileStatus(fileObj);
					  }
				  }
				);
			}, function (err) {
				logger.error('Error while fetching File Id', err)
	    })

		}
		catch(err) {
			console.log(err);
		}
	})
  setTimeout(registerCandidates, 1000);
}

module.exports = {
	registerCandidates: registerCandidates
}