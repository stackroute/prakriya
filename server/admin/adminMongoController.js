const userModel = require('../../models/users.js');
const roleModel = require('../../models/roles.js');


let getUsers = function(successCB, errorCB) {
	userModel.find({},function(err, result) {
		if (err) {
			errorCB(err);
		}
		successCB(result);
	});
}


let getRoles = function(successCB, errorCB) {
	roleModel.find({},function(err, result) {
		if (err) {
				errorCB(err);
		}
		successCB(result);
	});
}


module.exports = {
	getUsers: getUsers,
	getRoles: getRoles
}