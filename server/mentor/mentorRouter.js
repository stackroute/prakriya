const router = require('express').Router();
const users = require('../../models/users.js');
const mentorMongoController = require('./mentorMongoController');
var auth = require('../auth')();
var CONFIG = require('../../config');

/**************************************************
*******          AssessmentTrack           ********
***************************************************/

// Get all training tracks
router.get("/trainingtracks", auth.canAccess(CONFIG.MENTOR), function(req, res) {

  console.log("API HIT ===> GET TrainingTracks");
  try{
    mentorMongoController.getTrainingTracks(function(trainingtracks) {
      res.status(201).json({trainingtracks: trainingtracks});
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all training tracks from db...!' });
    });
  }
  catch(err){
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get all waves
router.get("/waves/:trainingTrack", auth.canAccess(CONFIG.MENTOR), function(req, res) {

  console.log("API HIT ===> GET Waves");
  try{
    mentorMongoController.getWaves(req.params.trainingTrack, function(waves) {
      res.status(201).json({waves: waves});
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all waves from db...!' });
    });
  }
  catch(err){
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get all courses
router.get("/courses/:wave", auth.canAccess(CONFIG.MENTOR), function(req, res) {

  console.log("API HIT ===> GET Courses");
  try{
    mentorMongoController.getCourses(req.params.wave, function(courses) {
      res.status(201).json({courses: courses});
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all courses from db...!' });
    });
  }
  catch(err){
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

// Get all candidates and tracks
router.get("/candidatesandtracks/:trainingTrack/:wave/:course", auth.canAccess(CONFIG.MENTOR), function(req, res) {

  console.log("API HIT ===> GET Candidates And Tracks");
  try{
    mentorMongoController.getCandidates(req.params.trainingTrack, req.params.wave, req.params.course,
       function(candidates) {
         console.log('Candidates Fetched: ', JSON.stringify(candidates))
         mentorMongoController.getAssesmentTrack(req.params.trainingTrack, req.params.wave, req.params.course,
           function(assessmentTrack) {
             console.log('AssessmentTrack Fetched: ', JSON.stringify(assessmentTrack))
              res.status(201).json({
                candidates: candidates,
                assessmentTrack: assessmentTrack
              });
           },
           function(err) {
              res.status(500).json({ error: 'Cannot get the assessment track from db...!'});
           }
         )
    }, function(err) {
      res.status(500).json({ error: 'Cannot get all candidates from db...!'});
    });
  }
  catch(err){
    console.log('Caught: ', err)
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

router.post('/unlockuser', auth.canAccess(CONFIG.ADMIN), function(req, res) {
  try {
    adminMongoController.unlockUser(req.body, function (status) {
      res.status(200).json(status)
    }, function (err) {
      res.status(500).json({ error: 'Cannot unlock user account in db...!' });
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
