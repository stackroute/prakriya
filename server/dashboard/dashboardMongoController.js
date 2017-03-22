const RoleModel = require('../../models/roles.js');

let getPermissions =  function(role, successCB, errorCB) {
	RoleModel.findOne({"role": role},function(err, result) {
		if (err) {
			errorCB(err);
		}
		successCB(result);
	});
}

module.exports = {
	getPermissions: getPermissions
}