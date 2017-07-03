const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  Day: Number,
  Name: String,
  Description: String,
  Skills: [String],
  Status: String,
  SessionBy: String,
  SessionOn: Date
})

const wave = new Schema({
  WaveID: {type: String, unique: true},
  WaveNumber: String,
  Mode: String,
  Course: String,
  StartDate: Date,
  EndDate: Date,
  Location: String,
  Cadets: [Number],
  Sessions: [sessionSchema]
});

module.exports = mongoose.model('Wave', wave);
