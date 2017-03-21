const router = require('express').Router();
const users = require('../../models/users.js');
// const passport = require('passport');
var auth = require('../auth')();
const adminMongoController = require('./adminMongoController');

/****************************************
*******          Users           ******** 
****************************************/

// Get all the users
router.get("/users", auth.authenticate(), function(req, res) {

  console.log("API HIT!!!");  
  try{
    adminMongoController.getUsers(function(users) {
      res.status(201).json(users);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all users from db...!' });
    });
  }
  catch(err){
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
});

//Add a new user
router.post('/adduser', auth.authenticate(), function(req, res) {
    let user = req.body
    // user.username = user.email.split('@')[0]
    adminMongoController.addUser(user)
      .then(function(savedUser) {
        res.send(user)
      })
  }
)

router.delete('/deleteuser', auth.authenticate(), function(req, res) {
  console.log(req.body)
    try {
      adminMongoController.deleteUser(req.body, function (status) {
        res.status(200).json(status)
      }, function (err) {
        res.status(500).json({ error: 'Cannot delete user in db...!' });
      })
    }
    catch(err) {
      res.status(500).json({
        error: 'Internal error occurred, please report...!'
      }); 
    }
  }
)  


/****************************************
*******          Roles           ******** 
****************************************/

// Get all the roles
router.get('/roles', auth.authenticate(), function (req, res) {
  try{
    adminMongoController.getRoles(function(roles) {
      res.status(201).json(roles);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all roles from db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

//Add a new role
router.post('/addrole', auth.authenticate(), function(req, res) {
    try {
      adminMongoController.addRole(req.body, function (role) {
        res.status(200).json(role)
      }, function (err) {
        res.status(500).json({ error: 'Cannot add role in db...!' });
      })
    }
    catch(err) {
      res.status(500).json({
        error: 'Internal error occurred, please report...!'
      }); 
    }
  }
)

//Update role
router.post('/updaterole', auth.authenticate(), function(req, res) {
    try {
      adminMongoController.updateRole(req.body, function (status) {
        res.status(200).json(status)
      }, function (err) {
        res.status(500).json({ error: 'Cannot update role in db...!' });
      })
    }
    catch(err) {
      res.status(500).json({
        error: 'Internal error occurred, please report...!'
      }); 
    }
  }
)

//Delete a role
router.delete('/deleterole', auth.authenticate(), function(req, res) {
    try {
      adminMongoController.deleteRole(req.body, function (status) {
        res.status(200).json(status)
      }, function (err) {
        res.status(500).json({ error: 'Cannot delete role in db...!' });
      })
    }
    catch(err) {
      res.status(500).json({
        error: 'Internal error occurred, please report...!'
      }); 
    }
  }
)

/****************************************
*******       Permissions        ******** 
****************************************/

// Get all the permissions
router.get('/permissions', auth.authenticate(), function (req, res) {
  try{
    adminMongoController.getPermissions(function(permissions) {
      res.status(201).json(permissions);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all permissions from db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

module.exports = router;

