const UserModel = require('../../models/users.js');

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

module.exports = {
	addUser: addUser
}