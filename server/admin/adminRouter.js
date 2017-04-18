const router = require('express').Router();
const users = require('../../models/users.js');
const adminMongoController = require('./adminMongoController');
var auth = require('../auth')();
var CONFIG = require('../../config');

/****************************************
*******          Users           ******** 
****************************************/

// Get all the users
router.get("/users", auth.canAccess(CONFIG.ADMIN), function(req, res) {

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
router.post('/adduser', auth.canAccess(CONFIG.ADMIN), function(req, res) {
  let user = req.body
  try{
    adminMongoController.addUser(user, function(user) {
      res.status(200).json(user)
    }, function (err) {
      res.status(500).json({ error: 'Cannot add user in db...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

router.delete('/deleteuser', auth.canAccess(CONFIG.ADMIN), function(req, res) {
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
})  

router.post('/updateuser', auth.canAccess(CONFIG.ADMIN), function(req, res) {
  try {
    adminMongoController.updateUser(req.body, function (status) {
      res.status(200).json(status)
    }, function (err) {
      res.status(500).json({ error: 'Cannot update user in db...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

router.post('/lockuser', auth.canAccess(CONFIG.ADMIN), function(req, res) {
  try {
    adminMongoController.lockUser(req.body, function (status) {
      res.status(200).json(status)
    }, function (err) {
      res.status(500).json({ error: 'Cannot lock user account in db...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})


/****************************************
*******          Roles           ******** 
****************************************/

// Get all the roles
router.get('/roles', auth.canAccess(CONFIG.ADMIN), function(req, res) {
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
router.post('/addrole', auth.canAccess(CONFIG.ADMIN), function(req, res) {
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
router.post('/updaterole', auth.canAccess(CONFIG.ADMIN), function(req, res) {
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
router.delete('/deleterole', auth.canAccess(CONFIG.ADMIN), function(req, res) {
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
********       Controls        ********** 
****************************************/

// Get all the access controls
router.get('/accesscontrols', auth.canAccess(CONFIG.ADMIN), function(req, res) {
  try{
    adminMongoController.getAccessControls(function(controls) {
      res.status(201).json(controls);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all access controls from db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

module.exports = router;

