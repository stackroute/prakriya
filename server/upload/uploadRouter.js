const router = require('express').Router();
const auth = require('../auth')();
const formidable = require('formidable');
const fs = require('fs');
const client = require('redis').createClient();
const uploadMongoController = require('./uploadMongoController');

router.post('/cadets', auth.authenticate(), function(req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		fs.readFile(files.file.path, 'utf8', (err, data) => {
			try {
				let fileObj = {};
				fileObj.fileId = files.file.name.replace(/\s/g,'') + Date.now();
				fileObj.data = data;
				fileObj.fileName = files.file.name;
				fileObj.submittedOn = Date.now();
				fileObj.status = 'processing';
				fileObj.addedBy = req.user.name;
				console.log('FileObj created', fileObj)
	      uploadMongoController.addFile(fileObj, function (file) {
	      	client.rpush('fileImport', file.fileId);
	        res.status(200).json(file)
	      }, function (err) {
	        res.status(500).json({ error: 'Cannot add role in db...!' });
	      })
	    }
	    catch(err) {
	      res.status(500).json({
	        error: 'Internal error occurred, please report...!'
	      }); 
	    }
		});
	})
 })

module.exports = router;