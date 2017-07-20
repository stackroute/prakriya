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
				try {
					let result = [];

					let lines = zcop_data.split('\n');
					let headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
					lines.map(function (line, index) {
						if(index > 0 && line !== '') {
							let lineCol = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
							let cadetObj = {};

							headers.map(function (head, key) {
								if(lineCol[key] !== '') {
									cadetObj[head] = lineCol[key];
								}
							});

							let obj = {};

							obj['Employee ID'] = cadetObj['EMP_CODE'];
							obj['Employee Name'] = cadetObj['EMP_NAME'];
							obj['Email ID'] = cadetObj['EMPLOYEE_EMAIL_ID'];
							obj['Digi-thon Qualified'] = '';
							obj['WT/WI'] = '';
							obj['Billability'] = cadetObj['BILLABILITY_STATUS'];
							obj['Career Band'] = cadetObj['CAREER_BAND'];
							obj['Initial BU'] = ''
							if(cadetObj.MODEL_TYPE == 'A' || cadetObj.MODEL_TYPE == 'C') {
								obj['Revised BU'] = cadetObj.SAP_PRAC_DESC;
							}
							else if(cadetObj.MODEL_TYPE == 'B' || cadetObj.MODEL_TYPE == 'N' || cadetObj.MODEL_TYPE == 'R') {
								obj['Revised BU'] = cadetObj.SAP_BU_DESC
							}
							obj['Work Experience'] = cadetObj['EXPERIENCE'];
							obj['Digi-Thon Phase'] = '';
							obj['Digi-thon Score'] = '';
							obj['Training Status'] = '';
							obj['Training Track'] = '';
							obj['Wave'] = '';
							obj['Start Date'] = '';
							obj['End Date'] = '';
							obj['Academy Training Skills'] = '';
							obj['Skill - Set'] = '';
							obj['Cadet Evaluation'] = '';
							obj['Plan for Available Pool'] = '';
							obj['Comments / Current / Future Plan'] = '';
							obj['Project Status'] = '';
							obj['Project - Billability'] = '';
							obj['Remarks / Account Name'] = '';
							obj['Project Name'] = '';
							obj['Project Status'] = '';
							obj['Project Status'] = '';
							obj['sap'] = cadetObj['PROJECT'];
							obj['Future Billability'] = '';
							obj['Future BD'] = '';
							obj['Project End date'] = '';
							obj['Chk'] = '';
							obj['Leadership Report'] = '';
							obj['Resignation Reason'] = '';
							obj['Pledge'] = '';
							obj['Preferred Location 1'] = '';
							obj['Preferred Location 2'] = '';
							obj['Preferred Location 3'] = '';
							obj['PRP Score'] = '';
							obj['Home / Prac CC'] = cadetObj['PRAC_CC'];
							obj['Cost Center'] = cadetObj['COSTCTR'];
							obj['Primary Supervisor'] = cadetObj['PRIMARY_SUPERVISOR'];
							obj['Project Supervisor'] = cadetObj['PROJECT_SUPERVISOR'];
							obj['EM'] = '';
							obj['Reported'] = '';
							obj['Mentor Meet'] = '';
							obj['Interns / FEP'] = '';
							obj['FEP_ZCOP'] = '';
							obj['FEP Tagging'] = '';
							obj['FEP Reason'] = '';
							result.push(obj);
						}
					});
					res.status(200).json(result);
				} catch(err4) {
					logger.error('Error', err4);
					res.status(500).json({
						error: 'Internal error occurred, please report...!'
					});
				}
			});
		});
	});
});

module.exports = router;
