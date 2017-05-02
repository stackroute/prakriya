var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var subSchema = new Schema({
  Week:Number,
  Activities:String,
  Status:String,
  ContextSetSession:String,
  SessionBy:String,
  SessionOn:String,
  Remarks:String
})

var wave= new Schema({
  WaveID:Number,
  WaveNumber:Number,
  TrainingTrack:String,
  CourseName:String,
  StartDate:Date,
  EndDate:Date,
  Location:String,
  Sessions:[subSchema]
});

module.exports = mongoose.model('Wave', wave);
