let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let coursecolumns = new Schema({
  ID: {type: String, unique: true},
  EvaluationFields: [String],
  FeedbackFields: [String]
});

module.exports = mongoose.model('CourseColumns', coursecolumns);
