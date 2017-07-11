const router = require('express').Router();
const formidable = require('formidable');
const fs = require('fs');
const mkdirp = require('mkdirp');
const logger = require('./../../applogger');
const dashboardMongoController = require('./dashboardMongoController');
const dashboardNeo4jController = require('./dashboardNeo4jController');
const adminMongoController = require('../admin/adminMongoController.js');
const email = require('./../email');
let auth = require('../auth')();
let CONFIG = require('../../config');

/** **************************************************
*******          Notification System         ********
****************************************************/

router.post('/addnotification', auth.canAccess(CONFIG.ALL), function (req, res) {
   logger.info('API HIT ==> ADD NOTIFICATION');
   try {
    dashboardMongoController.addNotification(req.body.to, req.body.message, function (status) {
      res.status(200).json(status);
    },
    function (err) {
      logger.error('Add Notification Error: ', err);
      res.status(500).json({error: 'Cannot add notification...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

router.post('/deletenotification', auth.canAccess(CONFIG.ALL), function (req, res) {
   logger.info('API HIT ==> DELETE NOTIFICATION');
   try {
    dashboardMongoController.deleteNotification(req.body.to, req.body.message, function (status) {
      res.status(200).json(status);
    },
    function (err) {
      logger.error('Delete Notification Error: ', err);
      res.status(500).json({error: 'Cannot delete notification...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

router.get('/notifications', auth.canAccess(CONFIG.ALL), function (req, res) {
  try{
    dashboardMongoController.getNotifications(req.query.username, function (notifications) {
      res.status(201).json(notifications);
    }, function (err) {
      logger.error('Get Notifications Error: ', err);
      res.status(500).json({error: 'Cannot get all notifications from db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

router.post('/changepassword', auth.canAccess(CONFIG.ALL), function (req, res) {
   try {
    dashboardMongoController.changePassword(req.body, function (status) {
      res.status(200).json(status);
    },
    function (err) {
      logger.error('Change Password Error: ', err);
      res.status(500).json({error: 'Cannot change password...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// update last login
router.post('/lastlogin', auth.canAccess(CONFIG.ALL), function (req, res) {
  try {
    let user = req.user;
    user.lastLogin = req.body.lastLogin;
    logger.debug('Last Login', user);
    dashboardMongoController.updateLastLogin(user, function (userObj) {
      res.status(201).json(userObj);
    }, function (err) {
      logger.error('Last Login Error: ', err);
      res.status(500).json({error: 'Cannot update the last login...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

router.get('/user', function (req, res) {
  let userObj = {};
  try{
    dashboardMongoController.getPermissions(req.user.role, function (users) {
      adminMongoController.getAccessControls(function (controls) {
        let accesscontrols = [];
        controls.map(function (control) {
          if(users.controls.indexOf(control.code) >= 0) {
            accesscontrols.push(control.name);
          }
        });
        userObj.name = req.user.name;
        userObj.role = req.user.role;
        userObj.username = req.user.username;
        userObj.email = req.user.email;
        userObj.actions = accesscontrols;
        if(req.user.lastLogin !== undefined) {
          userObj.lastLogin = req.user.lastLogin;
        }
        res.status(201).json(userObj);
      }, function (err) {
        logger.error('Get Access Controls Error: ', err);
        res.status(500).json({error: 'Cannot get all controls from db...!'});
      });
    }, function (err) {
      logger.error('Get Controls of Role Error: ', err);
      res.status(500).json({error: 'Cannot get controls of role from db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

/** **************************************************
*******                 Wave                 ********
****************************************************/

// Add a new Wave
router.post('/addwave', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try {
    dashboardNeo4jController.addWave(req.body, function (wave) {
      res.status(200).json(wave);
    }, function (err) {
      logger.error('Add Wave Error: ', err);
      res.status(500).json({error: 'Cannot add wave in db...!'});
    });
  } catch(err) {
    console.log(err)
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

router.get('/wave', auth.canAccess(CONFIG.ALL), function (req, res) {
  try{
    dashboardNeo4jController.getWave(req.query.waveid, function (wave) {
      res.status(201).json(wave);
    }, function (err) {
      logger.error('Error 1', err);
      res.status(500).json({error: 'Cannot get wave from db...!'});
    });
  } catch(err) {
    logger.error('Error 2', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

router.get('/activewaves', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  try{
    dashboardMongoController.getActiveWaves(function (waves) {
      res.status(201).json(waves);
    }, function (err) {
      logger.error('Get Active Waves Error: ', err);
      res.status(500).json({error: 'Cannot get all active waves from db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

router.post('/updatecadetwave', auth.canAccess(CONFIG.ADMIN), function (req, res) {
  try{
    dashboardMongoController.updateCadetWave(req.body.cadets, req.body.waveID, function (status) {
      logger.debug('Update Cadet Status: ', status);
      res.status(201);
    }, function (err) {
      logger.error('Update Cadet Wave Error: ', err);
      res.status(500).json({error: 'Cannot update cadet wave...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

/** **************************************************
*******               Projects               ********
****************************************************/

// Get all projects
router.get('/projects', auth.canAccess(CONFIG.MENCAN), function (req, res) {
    try{
      dashboardNeo4jController.getProducts(function (projects) {
      res.status(201).json(projects);
    }, function (err) {
      logger.error('Get All Projects Error: ', err);
      res.status(500).json({error: 'Cannot get all projects from db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Add project
router.post('/addproject', auth.canAccess(CONFIG.MENTOR), function (req, res) {
  try {
    let projectObj = req.body;
    projectObj.version[0].addedBy = req.user.name;
    dashboardNeo4jController.addProduct(projectObj, function (project) {
      res.status(201).json(project);
    }, function (err) {
      logger.error('Add Project Error: ', err);
      res.status(500).json({error: 'Cannot add the project...!'});
    });
  } catch(err) {
    logger.error('Add Project Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// update a project
router.post('/updateproject', auth.canAccess(CONFIG.MENTOR), function (req, res) {
  try {
    let projectObj = req.body.project;
    projectObj.version[req.body.version].addedBy = req.user.name;
    projectObj.version[req.body.version].updatedBy = true;
    dashboardMongoController.
    updateProject(
      projectObj,
      req.body.delList,
      req.body.prevWave,
      req.body.version,
      function (project) {
        res.status(201).json(project);
      },
      function (err) {
        logger.error('Update Project Error: ', err);
        res.status(500).json({error: 'Cannot update the project...!'});
      }
    );
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// add a new version
router.post('/addversion', auth.canAccess(CONFIG.MENTOR), function (req, res) {
  try {
    let versionObj = req.body.version;
    versionObj.addedBy = req.user.name;
    versionObj.updatedBy = true;
    dashboardNeo4jController.addVersion(req.body.product, versionObj, function (project) {
      res.status(201).json(project);
    }, function (err) {
      logger.error('Add Version Error: ', err);
      res.status(500).json({error: 'Cannot update the project...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// delete a project
router.post('/deleteproject', auth.canAccess(CONFIG.MENTOR), function (req, res) {
  try {
    if(req.body.type === 'project') {
    let productName = req.body.project.product;
    dashboardNeo4jController.deleteProduct(productName, function (project) {
      res.status(201).json(project);
    }, function (err) {
      logger.error('Delete Project Error: ', err);
      res.status(500).json({error: 'Cannot delete the project...!'});
    });
    } else {
      let versionName = req.body.project.name;
      dashboardNeo4jController.deleteVersion(versionName, function (version) {
        res.status(201).json(version);
      }, function (err) {
        logger.error('Delete Version Error: ', err);
        res.status(500).json({error: 'Cannot delete the version...!'});
      });
    }
  } catch(err) {
    logger.error('Delete Project Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get the candidate template
router.get('/candidatetemplate', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  res.send(CONFIG.CANDIDATE_TEMPLATE);
});

// Get the remarks template
router.get('/remarkstemplate', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  res.send(CONFIG.REMARKS_TEMPLATE);
});

// Get cadet profile
router.get('/cadet', auth.canAccess(CONFIG.CANDIDATE), function (req, res) {
  try {
    dashboardMongoController.getCadet(req.user.email, function (cadet) {
      res.status(201).json(cadet);
    }, function (err) {
      logger.error('Get Cadet: ', err);
      res.status(500).json({error: 'Cannot get the cadet from db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get user Role
router.get('/userrole', auth.canAccess(CONFIG.ALL), function (req, res) {
  try {
    dashboardMongoController.getUserRole(req.user.email, function (cadet) {
      res.status(201).json(cadet.role);
    }, function (err) {
      logger.error('Get User Role Error: ', err);
      res.status(500).json({error: 'Cannot get the role from db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});


// Get all the cadets
router.get('/cadets', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  try{
    dashboardNeo4jController.getCadets(function (cadets) {
      res.status(201).json(cadets);
    }, function (err) {
      logger.error('Get All Cadets Error: ', err);
      res.status(500).json({error: 'Cannot get all cadets from neo4j...!'});
    });
  } catch(err) {
    logger.debug('Get cadets error', err)
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get all the cadets who are not part of any wave
router.get('/newcadets', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  try{
    dashboardNeo4jController.getNewCadets(function (cadets) {
      res.status(201).json(cadets);
    }, function (err) {
      logger.error('Get All New Cadets Error: ', err);
      res.status(500).json({error: 'Cannot get all new cadets from neo4j...!'});
    });
  } catch(err) {
    logger.debug('Get cadets error',  err)
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Update a cadet
router.post('/updatecadet', auth.canAccess(CONFIG.ALL), function (req, res) {
  try {
    dashboardNeo4jController.updateCadet(req.body, function (status) {
      res.status(200).json(status);
    }, function (err) {
      logger.error('Update Cadet Error: ', err);
      res.status(500).json({error: 'Cannot update candidate in neo4j...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Update many cadets
router.post('/updatecadets', auth.canAccess(CONFIG.ALL), function (req, res) {
  try {
    dashboardNeo4jController.updateCadets(req.body, function (status) {
      res.status(200).json(status);
    }, function (err) {
      logger.error('Update Cadets Error: ', err);
      res.status(500).json({error: 'Cannot update candidates in db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Delete a cadet
router.delete('/deletecadet', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try {
    dashboardMongoController.deleteCadet(req.body, function (status) {
      res.status(200).json(status);
    }, function (err) {
      logger.error('Delete Cadet Error: ', err);
      res.status(500).json({error: 'Cannot delete candidate in db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get all the files
router.get('/files', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try{
    dashboardMongoController.getFiles(function (files) {
      res.status(201).json(files);
    }, function (err) {
      logger.error('Get All Files Error: ', err);
      res.status(500).json({error: 'Cannot get all files from db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Save the feedback
router.post('/savefeedback', auth.canAccess(CONFIG.CANDIDATE), function (req, res) {
  try {
    dashboardMongoController.saveFeedback(req.body, function (feedback) {
      res.status(200).json(feedback);
    }, function (err) {
      logger.error('Save Feedback Error: ', err);
      res.status(500).json({error: 'Cannot save feedback in db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Save the cadet evaluation
router.post('/saveevaluation', auth.canAccess(CONFIG.MENTOR), function (req, res) {
  try {
    dashboardMongoController.saveEvaluation(req.body, function (evalObj) {
      res.status(200).json(evalObj);
    }, function (err) {
      logger.error('Save Evaluation Error: ', err);
      res.status(500).json({error: 'Cannot save cadet evaluation in db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});


router.post('/saveimage', auth.canAccess(CONFIG.CANDIDATE), function (req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    fs.readFile(files.file.path, 'binary', (readFileError, data) => {
      try {
        let buffer = new Buffer(data, 'binary');
        let cadet = JSON.parse(fields.cadet);
        let img = {};
        let dir = './public/profilePics/';
        img.data = buffer;
        img.contentType = files.file.type;
        cadet.ProfilePic = img;
        if (!fs.existsSync('./public/')) {
          logger.debug('Public Directory not present');
          mkdirp.sync('./public/');
          mkdirp(dir);
        } else if(!fs.existsSync(dir)) {
          logger.debug('ProfilePics Directory not present');
          mkdirp(dir);
        }
        let imagePath = dir + cadet.EmployeeID + '.jpeg';
        logger.debug('Image Path', imagePath);
        fs.writeFile(imagePath, data, 'binary', function (writeFileError) {
            if(writeFileError) {
              throw writeFileError;
            }
        });
        res.send(data);
      } catch(err1) {
        logger.error(err1);
        res.status(500).json({
          error: 'Internal error occurred, please report...!'
        });
      }
    });
  });
});

router.get('/getimage', auth.canAccess(CONFIG.ALL), function (req, res) {
  try {
    logger.debug('Req in getImage', req.query.eid);
    fs.readFile('public/profilePics/' + req.query.eid + '.jpeg', 'binary', (err, data) => {
      if(err) {
        res.status(500).json({error: 'No image is available...!'});
      } else {
res.send(data);
}
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

/** **************************************************
*******          Attendance         ********
****************************************************/

// get all candidates for specific wave
router.get('/wavespecificcandidates', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  try{
    dashboardNeo4jController.getWaveSpecificCandidates(req.query.waveID, function (data) {
      console.log(data,"data")
      res.status(201).json({data: data});
    }, function (err) {
      logger.error('Get Wave Specific Candidates Error: ', err);
      res.status(500).json({error: 'Cannot get all candidate for specific wave from db...!'});
    });
  } catch(err) {
    logger.error('Get Wave Specific Candidates Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// update absentees
router.post('/updateabsentees', auth.canAccess(CONFIG.CANDIDATE), function (req, res) {
  try{
    dashboardMongoController.updateAbsentees(req.body, function (status) {
      logger.info('Update Cadet Wave Status: ', status);
      res.status(201).json({success: 'success'});
    }, function (err) {
      logger.error('Update Absentees Error: ', err);
      res.status(500).json({error: 'Cannot update candidate db...!'});
    });
  } catch(err) {
    logger.error('Update Absentees Error: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// update present
router.post('/updatepresent', auth.canAccess(CONFIG.CANDIDATE), function (req, res) {
  try{
    dashboardMongoController.updatePresent(req.body.EmployeeID, new Date(), function (status) {
      logger.info('Update Project Status: ', status);
      res.status(201).json({success: 'success'});
    }, function (err) {
      logger.error('Update Present Error: ', err);
      res.status(500).json({error: 'Cannot update candidate db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// update present
router.post('/present', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try{
    dashboardMongoController.updatePresent(req.body.EmployeeID, req.body.Date, function (status) {
      dashboardMongoController.cancelLeave({id: req.body.id}, function (cancelLeaveStatus) {
        logger.info('Update Present Status: ', status);
        logger.info('Cancel Leave Status: ', cancelLeaveStatus);
        res.status(201).json({success: 'success'});
      }, function (err) {
        logger.error('Cancel Leave Error: ', err);
        res.status(500).json({error: 'Cannot update candidate db...!'});
      });
    }, function (err) {
      logger.error('Update Present Error: ', err);
      res.status(500).json({error: 'Cannot update candidate db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// update absent
router.post('/absent', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try{
    dashboardMongoController.
    updateAbsentees({details: req.body.details, absentee: req.body.EmployeeID}, function (status) {
      dashboardMongoController.
      cancelPresent(req.body.EmployeeID, req.body.Date, function (cancelPresentStatus) {
        logger.info('Cancel Present Status: ', cancelPresentStatus);
        logger.info('Update Absent Status: ', status);
        res.status(201).json({success: 'success'});
      }, function (err) {
        logger.error('Cancel Present Error: ', err);
        res.status(500).json({error: 'Cannot update candidate db...!'});
      });
    }, function (err) {
      logger.error('Update Absent Error: ', err);
      res.status(500).json({error: 'Cannot update candidate db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// cancelleave
router.post('/cancelleave', auth.canAccess(CONFIG.CANDIDATE), function (req, res) {
  try{
    dashboardMongoController.cancelLeave(req.body, function (status) {
      logger.info('Cancel Leave Status: ', status);
      res.status(201).json({success: 'success'});
    }, function (err) {
      logger.error('Cancel Leave Error: ', err);
      res.status(500).json({error: 'Cannot update candidate db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// update absentees
router.post('/updateapproval', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try{
    dashboardMongoController.updateApproval(req.body, function (status) {
      logger.info('Update Absentees Status: ', status);
      res.status(201).json({success: 'success'});
    }, function (err) {
      logger.error('Update Absentees Error: ', err);
      res.status(500).json({error: 'Cannot update candidate db...!'});
    });
  } catch(err) {
    logger.error('Update Absentees Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

router.get('/getabsentees', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try{
    dashboardMongoController.getAbsentees(function (cadets) {
      res.status(201).json(cadets);
    }, function (err) {
      logger.error('Get Absentees Error: ', err);
      res.status(500).json({error: 'get absentees from db failed...!'});
    });
  } catch(err) {
    logger.error('Get Absentees Error: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get all courses
router.get('/courses', auth.canAccess(CONFIG.ADMMEN), function(req, res) {
  try {
    dashboardNeo4jController.getCourses(function(courses) {
      res.status(201).json(courses);
    }, function(err) {
      logger.error('Get Courses For Wave Error: ', err);
      res.status(500).json({error: 'Cannot get all courses from db...!'});
    })
  } catch(err) {
    logger.error('Get Courses Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
})

// add courses
router.post('/addcourse', auth.canAccess(CONFIG.MENCAN), function (req, res) {
  try{
    let courseObj = req.body;
    courseObj.History = courseObj.History + ' added by ' +
     req.user.name + ' on ' + new Date() + '\n';
    dashboardNeo4jController.addCourse(courseObj, function (courses) {
      res.status(201).json(courses);
    }, function (addcourseerr) {
      logger.error('err in addcourseerr', addcourseerr);
      res.status(500).json({error: 'Cannot add course in db...!'});
    });
  } catch(err) {
    logger.error(err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// update courses
router.post('/updatecourse', auth.canAccess(CONFIG.MENCAN), function (req, res) {
  try{
    let courseObj = req.body.course;
    courseObj.History = courseObj.History + ' last update by ' +
     req.user.name + ' on ' + new Date() + '\n';
    dashboardNeo4jController.updateCourse(courseObj, req.body.edit, function (courses) {
      res.status(201).json(courses);
    }, function (updateerr) {
      logger.error('err in update', updateerr);
      res.status(500).json({error: 'Cannot update course in db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// delete assignment or schedule
router.post('/deleteassignmentorschedule', auth.canAccess(CONFIG.MENCAN), function (req, res) {
  try{
    let obj = req.body.obj;
    console.log(req.body);
    dashboardNeo4jController.deleteAssignmentOrSchedule(obj, req.body.course, req.body.type, function (result) {
      res.status(201).json({success:'success'});
    }, function (updateerr) {
      logger.error('err in update', updateerr);
      res.status(500).json({error: 'Cannot update course in db...!'});
    });
  } catch(err) {
    console.log(err)
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Delete a course
router.post('/deletecourse', auth.canAccess(CONFIG.MENCAN), function (req, res) {
  try {
    let courseObj = req.body;
    courseObj.History = courseObj.History + ' deleted by ' +
     req.user.name + ' on ' + new Date() + '\n';
    dashboardNeo4jController.deleteOrRestoreCourse(courseObj, 'delete', function (status) {
      res.status(200).json(status);
    }, function (deletecourseerr) {
      logger.error('err in deletecourseerr', deletecourseerr);
      res.status(500).json({error: 'Cannot delete course in db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// restore a course
router.post('/restorecourse', auth.canAccess(CONFIG.MENCAN), function (req, res) {
  try {
    let courseObj = req.body;
    courseObj.History = 'restored by ' + req.user.name + ' on ' + new Date() + '\n';
    dashboardNeo4jController.deleteOrRestoreCourse(courseObj, 'restore', function (status) {
      res.status(200).json(status);
    }, function (restorecourseerr) {
      logger.error('err in restorecourseerr', restorecourseerr);
      res.status(500).json({error: 'Cannot restore course in db...!'});
    });
  } catch(err) {
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});


// Get course
router.get('/course/:courseID', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  try{
    dashboardMongoController.getCourse(req.params.courseID, function (data) {
      res.status(201).json(data);
    }, function (err) {
      logger.error('Get Course:', err);
      res.status(500).json({error: 'Cannot get course for specific course id from db...!'});
    });
  } catch(err) {
    logger.error('Get Course Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get all courses for specific wave
router.get('/assessment', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  try{
    console.log(req.query.waveid);
    dashboardNeo4jController.getAssessmentTrack(req.query.waveid, function (data) {
      res.status(201).json({data: data});
    }, function (err) {
      logger.error('Get Courses For Wave Error: ', err);
      res.status(500).json({error: 'Cannot get assessment for specific wave from db...!'});
    });
  } catch(err) {
    logger.error('Get Courses For Wave Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// map assessments
router.post('/assessmentdetails', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  try{
    dashboardNeo4jController.mapAssessmentTrack(req.body.assessment, req.body.update, function (data) {
      res.status(201).json({success: 'success'});
    }, function (err) {
      logger.error('Get Courses For Wave Error: ', err);
      res.status(500).json({error: 'Cannot map to assessment...!'});
    });
  } catch(err) {
    logger.error('Map assessments For Wave Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});


// map assessments
router.get('/assessmentandcandidates/:waveID/:assessment', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  console.log(req.params.waveID, req.params.assessment);
  try{
    dashboardNeo4jController.assessmentsandcandidates(req.params.waveID, req.params.assessment,  function (data) {
      res.status(201).json({data});
    }, function (err) {
      logger.error('Get Candidates For Wave Error: ', err);
      res.status(500).json({error: 'Cannot map to assessment...!'});
    });
  } catch(err) {
    logger.error('Get candidates For Wave Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});


// Get all candidates and tracks
router.
get('/candidatesandtracks/:waveID/:courseName', auth.canAccess(CONFIG.MENTOR), function (req, res) {
  logger.info('API HIT ===> GET Candidates And Tracks');
  try{
    dashboardNeo4jController.getWaveSpecificCandidates(req.params.waveID,
       function (candidates) {
         dashboardNeo4jController.getAssessmentTrack(req.params.courseName,
           function (assessmentTrack) {
              res.status(201).json({
                candidates: candidates,
                assessmentTrack: assessmentTrack.AssessmentCategories
              });
           },
           function (err) {
              logger.error('Get Assessment Tracks Error: ', err);
              res.status(500).json({error: 'Cannot get the assessment track from db...!'});
           }
         );
    }, function (err) {
      logger.error('Get Candidates And Assessment Tracks Error: ', err);
      res.status(500).json({error: 'Cannot get all candidates from db...!'});
    });
  } catch(err) {
    logger.error('Get Candidates And Assessment Tracks Exception:', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

/** **************************************************
**************          Common Routes        ********
****************************************************/

// get all unique waveid
router.get('/waveids', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  logger.info('API HIT ===> GET WAVEIDS');
  try{
    dashboardNeo4jController.getWaveIDs(function (waveids) {
      console.log(waveids,"waveids")
      res.status(201).json({waveids: waveids});
    }, function (err) {
      logger.error('Get All Wave IDs Error: ', err);
      res.status(500).json({error: 'Cannot get all unique waveIDs from db...!'});
    });
  } catch(err) {
    logger.error('Get All Wave IDs Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get a particular wave object based on wave id
router.get('/waveobject/:waveID', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  logger.info('API HIT ===> GET Wave Object');
  try{
    dashboardMongoController.getWaveObject(req.params.waveID,
       function (wave) {
         res.status(201).json({waveObject: wave});
    }, function (err) {
      logger.error('Get Wave Object Error: ', err);
      res.status(500).json({error: 'Cannot get wave from db...!'});
    });
  } catch(err) {
    logger.error('Get Wave Object Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

/** **************************************************
*******          Candidates                 ********
****************************************************/

// Save the cadet information
router.post('/addcandidate', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try {
    let cadet = req.body;
    console.log(req.body);
    console.log('///////////////////');
    dashboardMongoController.saveCandidate(cadet, function (result, err) {
      if(err) {
        logger.debug(err);
      }
      else {
          dashboardNeo4jController.addCadet(cadet, function (result) {
            logger.debug('Added the cadet', result)
                res.status(200).json(result);
            }, function(err) {
            logger.error('Error in adding a cadet in the neo4j',  err)
            res.status(500).json({error: 'Cannot save cadidate in neo4j...!'});
          })
        }
      })
    }
      catch(err) {
        logger.error('Add Candidate Exception: ', err);
        res.status(500).json({
          error: 'Internal error occurred, please report...!'
        });
      }
});

/** **************************************************
*******               Email                  ********
****************************************************/

// Get all the users
router.get('/users', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try{
    adminMongoController.getUsers(function (users) {
      res.status(201).json(users);
    }, function (err) {
      logger.error('Get All Users Error: ', err);
      res.status(500).json({error: 'Cannot get all users from db...!'});
    });
  } catch(err) {
    logger.error('Get All Users Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Send a new mail
router.post('/sendmail', function (req, res) {
  logger.debug('Email request', req.body);
  email.sendEmail(req.body).then(function (result) {
    logger.debug('Email status', result.msg);
    res.send({status: result.msg});
  });
});

// Get all waves
router.get('/waves', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try{
    dashboardNeo4jController.getWaves(function (waves) {
      res.status(201).json(waves);
    }, function (err) {
      logger.error('Get All Waves Error: ', err);
      res.status(500).json({error: 'Cannot get all waves from db...!'});
    });
  } catch(err) {
    logger.error('Get All Waves Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get all cadets of a particular wave
router.post('/cadetsofwave', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try{
    dashboardMongoController.getCadetsOfWave(req.body.cadets, function (cadets) {
      res.status(201).json(cadets);
    }, function (err) {
      logger.error('Get Cadets of Wave Error: ', err);
      res.status(500).json({error: 'Cannot get all waves from db...!'});
    });
  } catch(err) {
    logger.error('Get Cadets of Wave Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get all cadets of a particular project
router.post('/cadetsofproj', auth.canAccess(CONFIG.MENTOR), function (req, res) {
  try{
    dashboardMongoController.getCadetsOfProj(req.body.name, function (cadets) {
      res.status(201).json(cadets);
    }, function (err) {
      logger.error('Get Cadets of Project Error: ', err);
      res.status(500).json({error: 'Cannot get all waves from db...!'});
    });
  } catch(err) {
    logger.error('Get Cadets of Project Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});


// delete a wave
router.post('/deletewave', auth.canAccess(CONFIG.ADMINISTRATOR), function (req, res) {
  try {
    console.log(req.body.wave,"req.body.wave")
    dashboardNeo4jController.deleteWave(req.body.wave, function (wave) {
      res.status(201).json(wave);
    }, function (err) {
      logger.error('Delete Wave Error: ', err);
      res.status(500).json({error: 'Cannot delete the wave...!'});
    });
  } catch(err) {
    logger.error('Delete Wave Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// update a wave
router.post('/updatewave', auth.canAccess(CONFIG.ADMMEN), function (req, res) {
  try {
    dashboardMongoController.updateWave(req.body.wave, function (wave) {
      res.status(201).json(wave);
    }, function (err) {
      logger.error('Update Wave Error: ', err);
      res.status(500).json({error: 'Cannot delete the wave...!'});
    });
  } catch(err) {
    logger.error('Update Wave Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

/** **************************************************
*********          Candidate Filter         *********
****************************************************/

// Get filtered candidates
router.post('/filteredcandidates', auth.canAccess(CONFIG.ADMIN), function (req, res) {
  try{
    dashboardMongoController.getFilteredCandidates(req.body.filterQuery, function (candidates) {
      res.status(201).json(candidates);
    }, function (err) {
      logger.error('Filter Candidates Error: ', err);
      res.status(500).json({error: 'Cannot filter candidates from db...!'});
    });
  } catch(err) {
    logger.error('Filter Candidates Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

router.get('/billable', auth.canAccess(CONFIG.ALL), function (req, res) {
  try{
    dashboardMongoController.getBillability(function (billable) {
      res.status(201).json(billable);
    }, function (err) {
      logger.error('Get All billable Error: ', err);
      res.status(500).json({error: 'Cannot get all billable count from db...!'});
    });
  } catch(err) {
    logger.error('Get All billable Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});
router.get('/nonbillable', auth.canAccess(CONFIG.ALL), function (req, res) {
  try{
    dashboardMongoController.getNonBillability(function (nonbillable) {
      res.status(201).json(nonbillable);
    }, function (err) {
      logger.error('Get All non-billable Error: ', err);
      res.status(500).json({error: 'Cannot get all non-billable count from db...!'});
    });
  } catch(err) {
    logger.error('Get All non-billable Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});
router.get('/free', auth.canAccess(CONFIG.ALL), function (req, res) {
  try{
    dashboardMongoController.getBillabilityFree(function (free) {
      res.status(201).json(free);
    }, function (err) {
      logger.error('Get All billable-free Error: ', err);
      res.status(500).json({error: 'Cannot get all billable-free count from db...!'});
    });
  } catch(err) {
    logger.error('Get All billable-free Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});
router.get('/support', auth.canAccess(CONFIG.ALL), function (req, res) {
  try{
    dashboardMongoController.getBillabilitySupport(function (support) {
      res.status(201).json(support);
    }, function (err) {
      logger.error('Get All billable-support Error: ', err);
      res.status(500).json({error: 'Cannot get all billable-support count from db...!'});
    });
  } catch(err) {
    logger.error('Get All billable-support Exception: ', err);
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});
module.exports = router;
