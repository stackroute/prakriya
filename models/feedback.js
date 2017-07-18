var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var getDefaultDate = function() {
	let d = new Date();
	let dd = d.getDate();
	let MM = d.getMonth() + 1;
	let yyyy = d.getFullYear();
	dd = (dd > 9) ? ('' + dd) : ('0' + dd);
	MM = (MM > 9) ? ('' + MM) : ('0' + MM);
	return dd + '/' + MM + '/' + yyyy;
}

var feedback = new Schema({
	cadetID: {type: String, unique: true},
	cadetName: String,
	organization: {type: String, default: 'Wipro'},
	waveID: String,
  relevance: [Number],
  training: [Number],
  confidence: [Number],
  mentors: [Number],
  facilities: [Number],
  overall: [Number],
  mostLiked: String,
  leastLiked: String,
	submittedOn: {type: String, default: getDefaultDate()}
});

module.exports = mongoose.model('Feedback', feedback);
