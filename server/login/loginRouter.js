const router = require('express').Router();
let mongoose = require('mongoose');

const userModel = require('../../models/users.js');
const passport = require('passport');
let jwt = require('jwt-simple');
let cfg = require('../../config');
let auth = require('../auth')();


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


// encoding tokens here!!!!!
router.post('/', function(req, res) {
    if (req.body.username && req.body.password) {
        let uname = req.body.username;
        let password = req.body.password;

        let query = userModel.findOne({username: uname, password: password});

        let promise = query.exec();

        promise.then(function(user) {
          console.log('User object in the loginRouter', user);
          if (user) {
            if(user.role !== 'admin' && user.actions.indexOf('login') <= -1)
            {
              res.send('Account suspended');
            }
            else {
              let payload = {
                  id: user._id,
                  user: user.username
              };
              console.log(payload);
              let token = jwt.encode(payload, cfg.jwtSecret);
      // expiresIn: 10080 // in seconds});
              console.log(token);
              res.json({
                  // user: user,
                  token: 'JWT ' + token
              });
            }
          } else {
              res.sendStatus(401);
          }
        });
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;
