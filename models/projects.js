var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var projects = new Schema({
    name: {type: String, unique: true},
    description: String,
    wave: String,
    members: [{EmployeeID:Number,EmployeeName:String}],
    skills: [String],
    addedBy: String,
    addedOn: {type: Date, default: Date.now() },
    updated: {type: Boolean, default: false }
});

module.exports = mongoose.model('Projects', projects);