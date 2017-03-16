const userModel = require('../../models/users.js');

function getUsers(successCB, errorCB) {
		
		userModel.find({},function(err, result) {
				if (err) {
						errorCB(err);
				}
				successCB(result);

				
		});
		
}


module.exports = {
	getUsers: getUsers
}


