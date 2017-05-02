const router = require('express').Router();
const formidable = require('formidable');
const fs = require('fs');
var auth = require('../auth')();
const dashboardMongoController = require('./dashboardMongoController');
const adminMongoController = require('../admin/adminMongoController.js');
var auth = require('../auth')();
var CONFIG = require('../../config');

router.get("/user", function(req, res) {  
  // res.json(users[req.user.id]);
  console.log("req from user!!!")
  console.log('User object sent ', req.user);
  let userObj = {};
  try{
    dashboardMongoController.getPermissions(req.user.role, function(users) {
      // userObj.actions = req.user.actions.filter(function(action) {
      //   return action != "Login";
      // });
      adminMongoController.getAccessControls(function(controls) {
        let accesscontrols = [];
        controls.map(function (control, key) {
          if(users.controls.indexOf(control.code) >= 0)
            accesscontrols.push(control.name)
        })
        console.log('Permissions from role', users);
        userObj.name = req.user.name;
        userObj.role = req.user.role;
        userObj.username = req.user.username;
        userObj.email = req.user.email;
        userObj.actions = accesscontrols;
        console.log('Converted User object ', userObj)
        res.status(201).json(userObj);
      }, function(err) {
        res.status(500).json({ error: 'Cannot get all controls from db...!' });
      })
    }, function(err) {
      res.status(500).json({ error: 'Cannot get controls of role from db...!' });
    });
  }
  catch(err){
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
});

// Get all projects
router.get('/projects', auth.canAccess(CONFIG.MENCAN), function(req, res) {
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
router.post('/addproject', auth.canAccess(CONFIG.MENTOR), function(req, res) {
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
router.get('/cadet', auth.canAccess(CONFIG.CANDIDATE), function(req, res) {
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
router.get('/cadets', auth.canAccess(CONFIG.ADMMEN), function(req, res) {
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
router.post('/updatecadet', auth.canAccess(CONFIG.ADMCAN), function(req, res) {
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
router.delete('/deletecadet', auth.canAccess(CONFIG.ADMINISTRATOR), function(req, res) {
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
router.get('/files', auth.canAccess(CONFIG.ADMINISTRATOR), function(req, res) {
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
router.post('/savefeedback', auth.canAccess(CONFIG.CANDIDATE), function(req, res) {
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

// Save the cadet evaluation
router.post('/saveevaluation', auth.canAccess(CONFIG.MENTOR), function(req, res) {
  try {
    dashboardMongoController.saveEvaluation(req.body, function (eval) {
      res.status(200).json(eval)
    }, function (err) {
      res.status(500).json({ error: 'Cannot save cadet evaluation in db...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

// Get all courses
router.get('/courses', auth.canAccess(CONFIG.MENCAN), function(req, res) {
  try{
    dashboardMongoController.getCourses(function(course) {
      res.status(201).json(course);
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all courses from db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

// update courses
router.post('/updatecourse', auth.canAccess(CONFIG.MENCAN), function(req, res) {
  try{
    dashboardMongoController.updateCourse(req.body, function(courses) {
      res.status(201).json(courses);
    }, function(err) {
      res.status(500).json({ error: 'Cannot update course in db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

// add courses
router.post('/addcourse', auth.canAccess(CONFIG.MENCAN), function(req, res) {
  try{
    dashboardMongoController.addCourse(req.body, function(courses) {
      res.status(201).json(courses);
    }, function(err) {
      res.status(500).json({ error: 'Cannot add course in db...!' });
    });
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})
// Delete a course
router.delete('/deletecourse', auth.canAccess(CONFIG.MENCAN), function(req, res) {
  try {
    dashboardMongoController.deleteCourse(req.body, function (status) {
      res.status(200).json(status)
    }, function (err) {
      res.status(500).json({ error: 'Cannot delete course in db...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

// restore a course
router.post('/restorecourse', auth.canAccess(CONFIG.MENCAN), function(req, res) {
  try {
    dashboardMongoController.restoreCourse(req.body, function (status) {
      res.status(200).json(status)
    }, function (err) {
      res.status(500).json({ error: 'Cannot restore course in db...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    }); 
  }
})

//Add category
router.post('/addcategory', auth.canAccess(CONFIG.MENCAN), function(req, res) {
  try {
    dashboardMongoController.addCategory(req.body, function(status) {
      res.json(status)
    }, function (err) {
      res.status(500).json({ error: 'Cannot add the category...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
})

//delete category
router.post('/deletecategory', auth.canAccess(CONFIG.MENCAN), function(req, res) {
  try {
    console.log('he is here');
    dashboardMongoController.deleteCategory(req.body, function(status) {
      res.json(status)
    }, function (err) {
      res.status(500).json({ error: 'Cannot delete the category...!' });
    })
  }
  catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
})

router.post('/saveimage', auth.canAccess(CONFIG.CANDIDATE), function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    fs.readFile(files.file.path, 'binary', (err, data) => {
      try {
        let buffer = new Buffer(data, 'binary')
        let cadet = JSON.parse(fields.cadet);
        let img = {};
        img.data = buffer;
        img.contentType = files.file.type;
        cadet.ProfilePic = img;
        let imagePath = 'public/profilePics/' + cadet.EmployeeID + '.jpeg'
        fs.writeFile(imagePath, data, 'binary', function(err){
            if (err) throw err
            console.log('File saved.')
        })
        res.send(data);
      }
      catch(err) {
        res.status(500).json({
          error: 'Internal error occurred, please report...!'
        }); 
      }
    });
  })
})

router.get('/getimage', auth.canAccess(CONFIG.CANDIDATE), function(req, res) {
  try {
    dashboardMongoController.getCadet(req.user.email, function(cadet) {
      fs.readFile('public/profilePics/' + cadet.EmployeeID + '.jpeg', 'binary', (err, data) => {
        res.send(data);
      });
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

module.exports = router;