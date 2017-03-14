const router = require('express').Router();
var mongoose = require('mongoose');

const userModel = require('../../models/users.js');
const passport = require('passport');
var jwt = require("jwt-simple");  
var cfg = require("../config.js"); 
var auth = require('../auth/auth.js')();


router.post('/', 
  passport.authenticate(
  	'local', 
  	{
  		failureFlash : 'Invalid login attempt..!', 
  		successFlash: 'Welcome to Prakriya'
  	}
  ),
  function(req, res) {
    res.send(true);
  }
)

// function(username, password, done) {
//     userModel.findOne({ 'username' :  username }, 
//       function(err, user) {
//         // In case of any error, return using the done method
//         if (err)
//           return done(err);
//         // Username does not exist, log error & redirect back
//         if (!user){
//           console.log('User Not Found with username ',username);
//           return done(null, false, 
//                 req.flash('message', 'User Not found.'));                 
//         }
//         // // User exists but wrong password, log the error 
//         // if (!isValidPassword(user, password)){
//         //   console.log('Invalid Password');
//         //   return done(null, false, 
//         //       req.flash('message', 'Invalid Password'));
//         // }
//         // User and password both match, return user from 
//         // done method which will be treated like success
//         return done(null, user);
//       }
//     );
//   }

// function getUserPromise(name){
//    var promise = userModel.findOne({'username':name}).exec();
//    return promise;
// }


//encoding tokens here!!!!!
router.post("/token", function(req, res) {  
    if (req.body.username && req.body.password) {
        var uname = req.body.username;
        var password = req.body.password;

        let user = {}; 

        var query = userModel.findOne({'username': uname});

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

router.get("/user", auth.authenticate(), function(req, res) {  
    // res.json(users[req.user.id]);
    console.log("req from admin!!!")
    console.log(req);
    res.send("authenticated!!!!!")
});

module.exports = router;