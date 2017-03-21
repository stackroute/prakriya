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
  userObj.actions = req.user.actions.filter(function(action) {
    return action != "Login";
  });
  userObj.name = req.user.name;
  userObj.role = req.user.role;
  userObj.username = req.user.username;
  userObj.email = req.user.email;
  console.log('Converted User object ', userObj)
  res.send(userObj);
});

module.exports = router;