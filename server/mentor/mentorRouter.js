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
router.get("/coursesfrom/:wave", auth.canAccess(CONFIG.MENTOR), function(req, res) {

  console.log("API HIT ===> GET Courses");
  try{
    mentorMongoController.getCoursesFrom(req.params.wave, function(courses) {
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

// Update candidates' assessment track
router.post("/updatecandidateassessment", auth.canAccess(CONFIG.MENTOR), function(req, res) {

  console.log("API HIT ===> POST Update Candidate Assessment");
  try{
    mentorMongoController.updateCandidateAssessment(req.body, function(status) {
      res.status(200).json(status);
    }, function(err) {
      res.status(500).json({ error: 'Cannot update candidate in db...!'});
    });
  }
  catch(err){
    res.status(500).json({
      error: 'Internal error occurred, please report...!'
    });
  }
});

/****************************************************
*******          Course Management           ********
****************************************************/

// Get all courses
router.get('/courses', auth.canAccess(CONFIG.MENCAN), function(req, res) {
  try{
    mentorMongoController.getCourses(function(course) {
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
    mentorMongoController.updateCourse(req.body, function(courses) {
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
    mentorMongoController.addCourse(req.body, function(courses) {
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
    mentorMongoController.deleteCourse(req.body, function (status) {
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
    mentorMongoController.restoreCourse(req.body, function (status) {
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
    mentorMongoController.addCategory(req.body, function(status) {
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
    mentorMongoController.deleteCategory(req.body, function(status) {
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

module.exports = router;
