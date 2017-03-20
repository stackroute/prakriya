const UserModel = require('../../models/users.js');
const RoleModel = require('../../models/roles.js'); 
const PermissionModel = require('../../models/permissions.js');

let getUsers = function(successCB, errorCB) {
	UserModel.find({},function(err, result) {
		if (err) {
			errorCB(err);
		}
		successCB(result);
	});
}

let addUser = function(newUser) {
	let promise = new Promise(function(resolve, reject) {

		let saveUser = new UserModel(newUser);

		saveUser.save(function(err, savedUser) {
			if(err)
				reject(err)
			if (!savedUser) {
        reject({
          error: 'Null user object created in mongo..!'
        });
      }
      console.log("successfully saved new user ", savedUser);
      resolve(savedUser);
		})

	})
	return promise;
}

let getRoles = function(successCB, errorCB) {
	RoleModel.find({},function(err, result) {
		if (err) 
				errorCB(err);
		successCB(result);
	});
}

let addRole = function (roleObj, successCB, errorCB) {
	let saveRole = new RoleModel(roleObj)
	saveRole.save(roleObj, function (err, result) {
		if(err)
			errorCB(err);
		successCB(result);
	})
}

let deleteRole = function (roleObj, successCB, errorCB) {
	console.log('roleobj in mongo request', roleObj)
	RoleModel
		.find(roleObj)
		.remove(function (err, removed) {
			if(err)
				errorCB(err);
			successCB(removed);
		})
}

let getPermissions = function(successCB, errorCB) {
	PermissionModel.find({},function(err, result) {
		if (err) 
				errorCB(err);
		successCB(result);
	});
}

module.exports = {
	getUsers: getUsers,
	getRoles: getRoles,
	addUser: addUser,
	addRole: addRole,
	deleteRole: deleteRole
}