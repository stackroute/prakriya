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

let deleteUser = function (userObj, successCB, errorCB) {
	UserModel
		.find(userObj)
		.remove(function (err, status) {
			if(err)
				errorCB(err);
			successCB(status);
		})
}

let updateUser = function (userObj, successCB, errorCB) {
	console.log('User obj from server', userObj)
	console.log(userObj.username)
	UserModel.update({"username": userObj.username}, userObj, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

let getRoles = function(successCB, errorCB) {
	RoleModel.find({},function(err, result) {
		if (err) 
				errorCB(err);
		successCB(result);
	});
}

let addRole = function (roleObj, successCB, errorCB) {
	// roleObj.lastModified = new Date();
	let saveRole = new RoleModel(roleObj)
	saveRole.save(roleObj, function (err, result) {
		if(err)
			errorCB(err);
		successCB(result);
	})
}

let updateRole = function (roleObj, successCB, errorCB) {
	console.log('Role obj in Mongo', roleObj)
	console.log(roleObj.role)
	roleObj.lastModified= new Date();
	RoleModel.update({"role": roleObj.role}, roleObj, function(err, status) {
		if(err)
			errorCB(err);
		successCB(status);
	})
}

let deleteRole = function (roleObj, successCB, errorCB) {
	RoleModel
		.find(roleObj)
		.remove(function (err, status) {
			if(err)
				errorCB(err);
			successCB(status);
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
	getPermissions: getPermissions,
	addUser: addUser,
	addRole: addRole,
	updateRole: updateRole,
	deleteRole: deleteRole,
	deleteUser: deleteUser,
	updateUser: updateUser
}