const router = require('express').Router();
const auth = require('../auth')();
const formidable = require('formidable');
const fs = require('fs');
const uploadMongoController = require('./uploadMongoController');

router.post('/cadets', auth.authenticate(), function(req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		console.log('Req.files', files.file.path)
		fs.readFile(files.file.path, 'utf8', (err, data) => {
		  if (err) throw err;
		  let lines = data.split('\r\n');
		  let headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
		  lines.map(function (line, index) {
		  	if(index > 0 && line != '') {
		  		let line_col = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
		  		console.log('Line Col', line_col)
		  		let cadetObj = {};
		  		headers.map(function (head, key) {
		  			console.log('Row content', line_col[key])
		  			if(key > 0) {
		  				if(line_col[key] != '')
		  					cadetObj[head] = line_col[key];
		  			}
		  		})
		  		uploadMongoController.addCadet(cadetObj)
		  	}
		  })
		  res.send("File uploaded")
		});
	})
 })

module.exports = router;