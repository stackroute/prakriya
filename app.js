var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

var loginRoutes = require('./server/login');
var adminRoutes = require('./server/admin');
const userModel = require('./models/users.js');



//Connection with database
mongoose.connect('mongodb://localhost:27017/prakriya',function (error){
	if(error){
	   console.log(error);
	}
});

var db=mongoose.connection;
db.on('error',console.error.bind(console,'Conection Error..!!!!!!'));
db.once('open',function(){
  console.log("Connection established to MongoDB Successfully");
});

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
  function(username, password, done) {
    userModel.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username ',username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // // User exists but wrong password, log the error 
        // if (!isValidPassword(user, password)){
        //   console.log('Invalid Password');
        //   return done(null, false, 
        //       req.flash('message', 'Invalid Password'));
        // }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
  }
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  userModel.findOne({'_id': id}, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  })
});





// Create a new Express application.
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client')));
app.use(expressSession({secret: 'prakriya'}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/login', loginRoutes);
app.use('/admin', adminRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('Unexpected error: ', err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send({error: err});
});

module.exports = app;
