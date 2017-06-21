var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var versions = new Schema({
  name: {type: String, unique: true},
  description: String,
  wave: String,
  members: [{EmployeeID:Number,EmployeeName:String}],
  skills: [String],
  addedBy: String,
  addedOn: {type: Date, default: Date.now() },
  updated: {type: Boolean, default: false }
})

var projects = new Schema({
  product:{type: String, unique: true},
  description:String,
  version:[versions]
});

module.exports = mongoose.model('Projects', projects);
