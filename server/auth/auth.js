var passport = require("passport");  
var passportJWT = require("passport-jwt");  
const userModel = require('../../models/users.js');
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
    }
  };
};