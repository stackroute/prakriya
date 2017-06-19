const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  SessionID: Number,
  CourseName: String,
  Week: Number,
  Activities: String,
  Status: String,
  ContextSetSession: String,
  SessionBy: String,
  SessionOn: Date,
  Remarks: String
})

const cadetSchema = new Schema({
  CadetID: Number,
  Course: String
})

const wave = new Schema({
  WaveID: {type: String, unique: true},
  Mode: String,
  CourseNames: [String],
  StartDate: Date,
  EndDate: Date,
  Location: String,
  Cadets: [cadetSchema],
  Sessions: [sessionSchema]
});

module.exports = mongoose.model('Wave', wave);
