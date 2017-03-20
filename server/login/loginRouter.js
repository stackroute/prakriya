const router = require('express').Router();
var mongoose = require('mongoose');

const userModel = require('../../models/users.js');
const passport = require('passport');
var jwt = require("jwt-simple");  
var cfg = require("../config.js"); 
var auth = require('../auth')();


// router.post('/', 
//   passport.authenticate(
//   	'local', 
//   	{
//   		failureFlash : 'Invalid login attempt..!', 
//   		successFlash: 'Welcome to Prakriya'
//   	}
//   ),
//   function(req, res) {
//     res.send(true);
//   }
// )



//encoding tokens here!!!!!
router.post("/", function(req, res) {  
    if (req.body.username && req.body.password) {
        var uname = req.body.username;
        var password = req.body.password;

        let user = {}; 

        var query = userModel.findOne({'username': uname, 'password': password});

        var promise = query.exec();

        promise.then(function(user){
          console.log(user);
          // user = doc;
          if (user) {
              var payload = {
                  id: user._id,
                  user: user.username
              };
              console.log(payload);
              var token = jwt.encode(payload, cfg.jwtSecret);
      // expiresIn: 10080 // in seconds});
              console.log(token);
              res.json({
                  // user: user,
                  token: "JWT " + token
              });
          } else {
              res.sendStatus(401);
          }
        });
    } else {
        res.sendStatus(401);
    }   
});

module.exports = router;