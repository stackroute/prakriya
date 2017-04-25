var passport = require("passport");  
var passportJWT = require("passport-jwt");  
var userModel = require('../../models/users.js');
var roleModel = require('../../models/roles.js');
var cfg = require("../../config");  
var ExtractJwt = passportJWT.ExtractJwt;  
var JwtStrategy = passportJWT.Strategy;  
var params = {  
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {  

  passport.use(new JwtStrategy(params, function(jwt_payload, done) {
    console.log("payload for authentication!!!")
    console.log(jwt_payload);
    userModel.findOne({'username': jwt_payload.user}, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  }));

  
  // passport.use(strategy);

  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate("jwt", cfg.jwtSession);
    },
    canAccess: function (allowedRoles) {
      return function(req, res, next){
        if(allowedRoles.indexOf(req.user.role) >= 0)
          next();
        else 
          res.status(401).json({error: 'User is not authorized'});
      }
    },
    controlledBy: function (allowedControls) {
      return function(req, res, next){
        roleModel.findOne({'name': req.user.role}, function (err, role) {
          let allowed = false;
          role.controls.map(function(code, index) {
            if(allowedControls.indexOf(code) >= 0) 
              allowed = true;
          })

          if(allowed)
            next();
          else 
            res.status(401).json({error: 'User is not authorized'});
          })
      }
    }
  };
};