var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var feedback = new Schema({
	cadetID: {type: String, unique: true},
	cadetName: String,
  relevance: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  training: {
    1: Number,
    2: Number,
    3: Number,
    4: Number
  },
  confidence: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
    6: Number
  },
  mentors: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  facilities: {
    1: Number,
    2: Number,
    3: Number,
    4: Number
  },
  overall: {
    1: Number,
    2: Number,
    3: Number
  },
  mostLiked: String,
  leastLiked: String
});

module.exports = mongoose.model('Feedback', feedback);