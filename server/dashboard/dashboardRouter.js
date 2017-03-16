const router = require('express').Router();
const users = require('../../models/users.js');
const passport = require('passport');
var auth = require('../auth')();
const dashboardMongoController = require('./dashboardMongoController');

router.get("/getuser", auth.authenticate(), function(req, res) {  
    // res.json(users[req.user.id]);
    console.log("req from user!!!")
    console.log('User object sent ', req.user);
    let userObj = {};
    userObj.actions = req.user.actions.filter(function(action) {
        return action != "Login";
    });

    userObj.role = req.user.role;
    userObj.username = req.user.username;
    console.log('Converted User object ', userObj)
    res.send(userObj);
});

router.post('/adduser',function(req, res) {
    let user = req.body
    user.username = user.email.split('@')[0]
    adminMongoController.addUser(user)
      .then(function(savedUser) {
        res.send(user)
      })
  }
)

module.exports = router;