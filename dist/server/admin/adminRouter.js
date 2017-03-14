const router = require('express').Router();
<<<<<<< HEAD
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

=======
const passport = require('passport');
const adminMongoController = require('./adminMongoController');

router.post('/adduser',function(req, res) {
    let user = req.body
    user.username = user.email.split('@')[0]
    adminMongoController.addUser(user)
      .then(function(savedUser) {
        res.send(user)
      })
  }
)
>>>>>>> c47a9442bae0b812d615332a27f466e551e8ad6e

module.exports = router;