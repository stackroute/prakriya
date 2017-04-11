const path = require('path');
const logger = require('log4js').getLogger();
const RBAC = require('rbac').default;
const secure = require('rbac/controllers/express');

const loginRoutes = require('./login');
const dashboardRoutes = require('./dashboard');
const adminRoutes = require('./admin');
const uploadRoutes = require('./upload');
const service = require('./service');

function setupWebAppRESTRoutes(app) {
  // const rbac = new RBAC({
  //   roles: ['admin', 'administrator']  
  // }, (err, rbac) => {
  //   if (err) throw err;
  //   // setup express routes 
  //   app.use('/admin', secure.hasRole(rbac, 'admin'), adminRoutes);
  // });
  app.use('/login', loginRoutes);
  app.use('/dashboard', dashboardRoutes);
  app.use('/admin', adminRoutes);
  app.use('/upload', uploadRoutes);
  return app;
}

function welcome() {
  process.stdout.write('\n=========== Prakriya WWW ===========\n');
}

// App Constructor function is exported
module.exports = function() {

  welcome();
  
  let app = service.createApp();
  
  // app = service.setupWebpack(app);
  
  app = service.setupStaticRoutes(app);
  
  app = service.setupMiddlewares(app);
  
  app = setupWebAppRESTRoutes(app);
  
  app = service.setupRestRoutes(app);
  
  service.setupMongooseConnections();
  
  return app;
}

//Connection with database
// mongoose.connect('mongodb://localhost:27017/prakriya',function (error){
// 	if(error){
// 	   console.log(error);
// 	}
// });

// var db=mongoose.connection;
// db.on('error',console.error.bind(console,'Conection Error..!!!!!!'));
// db.once('open',function(){
//   console.log("Connection established to MongoDB Successfully");
// });





// Create a new Express application.
// var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'client')));
// app.use(expressSession({secret: 'prakriya'}));


// loads the auth.js during the server boot time and initiate the Passport middleware
// app.use(auth.initialize())
// app.use(passport.initialize());
// app.use(passport.session());


// app.use(flash());

// app.use('/login', loginRoutes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/admin', adminRoutes);
// app.use('/upload', uploadRoutes);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   console.log('Unexpected error: ', err);
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   res.status(err.status || 500);
//   res.send({error: err});
// });

// module.exports = app;
