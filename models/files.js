var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var files = new Schema({
		fileId: {type: String, unique: true},
		data: String,
    fileName: String,
    submittedOn: {type: Date, default: Date.now() },
    completedOn: Date,
    totalCadets: Number,
    importedCadets: Number,
    failedCadets: Number,
    status: String
});

module.exports = mongoose.model('Files', files);