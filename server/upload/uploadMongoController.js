const CandidateModel = require('../../models/candidates.js');

let addCadet = function (cadetObj) {
	let saveCadet = new CandidateModel(cadetObj)
	saveCadet.save(cadetObj, function (err, result) {
		if(err)
			console.log(err);
		console.log('Cadet saved',result);
	})
}

module.exports = {
	addCadet: addCadet
}