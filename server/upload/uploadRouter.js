const router = require('express').Router();
const formidable = require('formidable');
const fs = require('fs');
const logger = require('./../../applogger');
const client = require('redis').createClient();
// const client = require('redis').createClient(6379,'redis');
const uploadMongoController = require('./uploadMongoController');
const dashboardMongoController = require('../dashboard/dashboardMongoController');
let auth = require('../auth')();
let CONFIG = require('../../config');

router.post('/cadets', auth.canAccess(CONFIG.ADMINISTRATOR), function(req, res) {
	let form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		fs.readFile(files.file.path, 'utf8', (err, data) => {
			try {
				let fileObj = {};
				fileObj.fileId = files.file.name.replace(/\s/g, '') + Date.now();
				fileObj.data = data;
				fileObj.fileName = files.file.name;
				fileObj.submittedOn = Date.now();
				fileObj.status = 'processing';
				fileObj.addedBy = req.user.name;
				console.log('FileObj created', fileObj);
	      uploadMongoController.addFile(fileObj, function (file) {
	      	client.rpush('fileImport', file.fileId);
	        res.status(200).json(file);
	      }, function (err) {
	        res.status(500).json({ error: 'Cannot add role in db...!' });
	      });
	    }
	    catch(err) {
	      res.status(500).json({
	        error: 'Internal error occurred, please report...!'
	      });
	    }
		});
	});
});

router.post('/remarks', auth.canAccess(CONFIG.ADMINISTRATOR), function(req, res) {
	console.log('API HIT...');
	let form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		fs.readFile(files.file.path, 'utf8', (err, data) => {
			try {
				let lines = data.split('\n');
			  let headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
			  let cadetColln = [];
			  lines.map(function (line, index) {
			  	if(index > 0 && line != '') {
			  		let line_col = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
			  		let cadetObj = {};
			  		headers.map(function (head, key) {
			  			if(key > 0) {
			  				if(line_col[key] != '')
			  					{cadetObj[head] = line_col[key];}
			  			}
			  		});
			  		cadetColln.push(cadetObj);
			  	}
			  });
				console.log('Uploaded Cadets', cadetColln);
				cadetColln.map(function (cadet, i) {
					dashboardMongoController.updateCadet(cadet, function (status) {
						logger.info('Remarks updated for ', cadet.EmployeeID);
			    }, function (err) {
			    	logger.error('Error while saving remarks', err);
			    });
				});
				res.status(200).json({status: 'Remarks updated'});
	    }
	    catch(err) {
	    	console.log('Error', err);
	      res.status(500).json({
	        error: 'Internal error occurred, please report...!'
	      });
	    }
		});
	});
});

module.exports = router;
