var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');

var jwt = require("jwt-simple");  
var cfg = require("./server/config.js"); 
var auth = require("./server/auth/auth.js")();
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





// Create a new Express application.
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client')));
app.use(expressSession({secret: 'prakriya'}));


// loads the auth.js during the server boot time and initiate the Passport middleware
app.use(auth.initialize())
// app.use(passport.initialize());
// app.use(passport.session());


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
