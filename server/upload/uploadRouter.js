const router = require('express').Router();
const formidable = require('formidable');
const fs = require('fs');
const logger = require('./../../applogger');
const client = require('redis').createClient();
// const client = require('redis').createClient(6379,'redis');
const uploadMongoController = require('./uploadMongoController');
const dashboardNeo4jController = require('../dashboard/dashboardNeo4jController');
let auth = require('../auth')();
let CONFIG = require('../../config');

// Adding the cadets for the mentor connect
router.post('/cadets', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
	let form = new formidable.IncomingForm();
	form.parse(req, function (err1, fields, files) {
		fs.readFile(files.file.path, 'utf8', (err2, data) => {
			try {
				let fileObj = {};
				fileObj.fileId = files.file.name.replace(/\s/g, '') + Date.now();
				fileObj.data = data;
				fileObj.fileName = files.file.name;
				fileObj.submittedOn = Date.now();
				fileObj.status = 'processing';
				fileObj.addedBy = req.user.name;
				logger.debug('FileObj created', fileObj);
				uploadMongoController.addFile(fileObj, function (file) {
					client.rpush('fileImport', file.fileId);
					res.status(200).json(file);
				}, function (err3) {
					logger.error(err3);
					res.status(500).json({error: 'Cannot add file in db...!'});
				});
			} catch(err4) {
				res.status(500).json({
				error: 'Internal error occurred, please report...!'
				});
			}
		});
	});
});

// Adding remarks in bulk
router.post('/remarks', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
	let form = new formidable.IncomingForm();
	form.parse(req, function (err1, fields, files) {
		fs.readFile(files.file.path, 'utf8', (err2, data) => {
			try {
				let lines = data.split('\n');
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
					}
				});
				dashboardNeo4jController.updateCadets(cadetColln, function (status) {
		      res.status(200).json(status);
		    }, function (err) {
		      logger.error('Update Cadets Error: ', err);
		      res.status(500).json({error: 'Cannot update candidates in neo4j...!'});
		    });
			} catch(err4) {
				logger.error('Error', err4);
				res.status(500).json({
					error: 'Internal error occurred, please report...!'
				});
			}
		});
	});
});

// Merging two files
router.post('/merge', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
	let form = new formidable.IncomingForm();
	form.parse(req, function (err1, fields, files) {
		fs.readFile(files.zcop.path, 'utf8', (err2, zcop_data) => {
			fs.readFile(files.erd.path, 'utf8', (err2, erd_data) => {
				logger.debug('zcop data', zcop_data)
				logger.debug('erd data', erd_data)
				
			});
		});
	});
});

module.exports = router;
