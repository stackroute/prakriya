var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var feedback = new Schema({
	cadetID: {type: String, unique: true},
	waveID: String,
	cadetName: String,
  relevance: [Number],
  training: [Number],
  confidence: [Number],
  mentors: [Number],
  facilities: [Number],
  overall: [Number],
  mostLiked: String,
  leastLiked: String
});

module.exports = mongoose.model('Feedback', feedback);
