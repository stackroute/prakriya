const client = require('redis').createClient(6379,'redis');
const logger = require('log4js').getLogger();
const async = require('async');
const uploadMongoController = require('./uploadMongoController');

let registerCandidates = function () {
	client.brpop('fileImport', 0, function(err, fileId) {
		let importedCadets = [], failedCadets = [];
		try {
			uploadMongoController.getFileById(fileId, function (fileObj) {

				let lines = fileObj.data.split('\r\n');
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
			  		cadetObj['username'] = cadetObj.EmailID.split('@')[0];
			  		cadetObj['password'] = 'digital@123';
			  		cadetObj['role'] = 'candidate';
			  		cadetColln.push(cadetObj);
			  	}
			  })

			  async.each(cadetColln,
				  function(cadetObj, callback){
				    uploadMongoController.addCadet(cadetObj, function (cadet) {
			  			importedCadets.push(cadet);
			  			callback();
			  		}, function (err) {
			  			failedCadets.push(cadetObj);
			  			callback();
			  		})
				  },
				  function(err){
				  	logger.debug('Final function');
				    fileObj.completedOn = Date.now();
					  fileObj.totalCadets = lines.length-2;
					  fileObj.importedCadets = importedCadets.length;
					  fileObj.failedCadets = failedCadets.length;
					  if(fileObj.totalCadets ==  fileObj.importedCadets+fileObj.failedCadets)
					  	uploadMongoController.updateFileStatus(fileObj);
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