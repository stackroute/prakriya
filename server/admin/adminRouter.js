const router = require('express').Router();
const users = require('../../models/users.js');
const passport = require('passport');
var auth = require('../auth/auth.js')();
// var jwt = require("jwt-simple");  
// var cfg = require("./server/config.js"); 




router.get("/user", auth.authenticate(), function(req, res) {  
    // res.json(users[req.user.id]);
    console.log("req from admin!!!")
    console.log(req);
    res.send("authenticated!!!!!")
});


module.exports = router;