var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var subSchema = new Schema({
  SessionID: Number,
  CourseName: String,
  Week: Number,
  Activities: String,
  Status: String,
  ContextSetSession: String,
  SessionBy: String,
  SessionOn: String,
  Remarks: String
})

var wave = new Schema({
  WaveID: {type: String, unique: true},
  WaveNumber: String,
  TrainingTrack: String,
  CourseNames: [String],
  StartDate: Date,
  EndDate: Date,
  Location: String,
  Sessions: [subSchema]
});

module.exports = mongoose.model('Wave', wave);
