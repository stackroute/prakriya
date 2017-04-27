var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var evaluation = new Schema({
	cadetID: {type: String, unique: true},
	cadetName: String,
  attitude: Number,
  punctuality: Number,
  programming: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  codequality: {
    1: Number,
    2: Number,
    3: Number,
    4: Number
  },
  testability: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
    6: Number
  },
  engineeringculture: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  },
  technology: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
    6: Number,
    7: Number,
    8: Number,
    9: Number,
    10: Number,
    11: Number,
    12: Number,
    13: Number,
    14: Number,
    15: Number,
    16: Number,
    17: Number
  },
  communication: {
    1: Number,
    2: Number,
    3: Number
  },
  overall: Number,
  doneWell: String,
  improvement: String
});

module.exports = mongoose.model('Evaluation', evaluation);