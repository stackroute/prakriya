const router = require('express').Router();
var auth = require('../auth')();
const dashboardMongoController = require('./dashboardMongoController');

router.get("/user", auth.authenticate(), function(req, res) {  
  // res.json(users[req.user.id]);
  console.log("req from user!!!")
  console.log('User object sent ', req.user);
  let userObj = {};
  try{
    dashboardMongoController.getPermissions(req.user.role, function(users) {
      // userObj.actions = req.user.actions.filter(function(action) {
      //   return action != "Login";
      // });
      console.log('Permissions from role', users);
      userObj.name = req.user.name;
      userObj.role = req.user.role;
      userObj.username = req.user.username;
      userObj.email = req.user.email;
      userObj.actions = users.permissions;
      console.log('Converted User object ', userObj)
      res.status(201).json(userObj);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all permissions from db...!' });
    });
  }
  catch(err){
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
});

// Get all projects
router.get('/projects', auth.authenticate(), function (req, res) {
  try{
    dashboardMongoController.getProjects(function(projects) {
      res.status(201).json(projects);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all projects from db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

//Add project
router.post('/addproject', auth.authenticate(), function (req, res) {
  try {
    let projectObj = req.body;
    projectObj.addedBy = req.user.name;
    dashboardMongoController.addProject(projectObj, function(project) {
      res.status(201).json(project);
    }, function (err) {
      res.status(500).json({ error: 'Cannot add the project...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
})

// Get cadet profile
router.get('/cadet', auth.authenticate(), function (req, res) {
  try {
    dashboardMongoController.getCadet(req.user.email, function(cadet) {
      res.status(201).json(cadet);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get the cadet from db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
})

// Get all the cadets
router.get('/cadets', auth.authenticate(), function (req, res) {
  try{
    dashboardMongoController.getCadets(function(cadets) {
      res.status(201).json(cadets);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all cadets from db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

// Update a cadet
router.post('/updatecadet', auth.authenticate(), function(req, res) {
  try {
    dashboardMongoController.updateCadet(req.body, function (status) {
      res.status(200).json(status)
    }, function (err) {
      res.status(500).json({ error: 'Cannot update candidate in db...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

// Delete a cadet
router.delete('/deletecadet', auth.authenticate(), function(req, res) {
  console.log('reached to server');
  try {
    dashboardMongoController.deleteCadet(req.body, function (status) {
      res.status(200).json(status)
    }, function (err) {
      res.status(500).json({ error: 'Cannot delete candidate in db...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

// Get all the files
router.get('/files', auth.authenticate(), function (req, res) {
  try{
    dashboardMongoController.getFiles(function(files) {
      res.status(201).json(files);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all files from db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

// Save the feedback
router.post('/savefeedback', auth.authenticate(), function(req, res) {
  try {
    dashboardMongoController.saveFeedback(req.body, function (feedback) {
      res.status(200).json(feedback)
    }, function (err) {
      res.status(500).json({ error: 'Cannot save feedback in db...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

module.exports = router;