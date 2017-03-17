const router = require('express').Router();
const users = require('../../models/users.js');
// const passport = require('passport');
var auth = require('../auth')();
const adminMongoController = require('./adminMongoController');

// Get all the users
router.get("/users", auth.authenticate(), function(req, res) {

    console.log("API HIT!!!");  
    res.send(200);
    // res.json(users[req.user.id]);
    // console.log("req from user!!!")
    // console.log('User object sent ', req.user);
    // let userObj = {};
    // userObj.actions = req.user.actions.filter(function(action) {
    //     return action != "Login";
    // });

    // userObj.role = req.user.role;
    // userObj.username = req.user.username;
    // console.log('Converted User object ', userObj)
    // res.send(userObj);
});

// Get all the roles
router.get('/roles', auth.authenticate(), function (req, res) {
    adminMongoController.getAllRoles()
})

module.exports = router;