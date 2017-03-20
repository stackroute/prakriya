var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var permissions = new Schema({
    permissions: [String]
});

module.exports = mongoose.model('Permissions', permissions);