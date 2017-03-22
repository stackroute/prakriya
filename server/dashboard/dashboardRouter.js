const router = require('express').Router();
const users = require('../../models/users.js');
// const passport = require('passport');
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

module.exports = router;