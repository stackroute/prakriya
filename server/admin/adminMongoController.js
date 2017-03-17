const userModel = require('../../models/users.js');
const roleModel = require('../../models/roles.js');


function getUsers(successCB, errorCB) {
		
		userModel.find({},function(err, result) {
				if (err) {
						errorCB(err);
				}
				successCB(result);

				
		});
		
}


let getAllRoles = function() {
	

}


module.exports = {
	getUsers: getUsers,
	getAllRoles: getAllRoles
}