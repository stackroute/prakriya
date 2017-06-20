const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const auth = require('./auth')();
const CONFIG = require('../config');
const logger = require('./../applogger');

function createApp() {
  const app = express();
  return app;
}

function setupStaticRoutes(app) {
  app.use(express.static(path.resolve(__dirname, '../', 'client')));
  return app;
}

function setupRestRoutes(app) {
  //  MOUNT YOUR REST ROUTE HERE
  //  Eg: app.use('/resource', require(path.join(__dirname, './module')));

  app.use(function (req, res) {
    let err = new Error('Resource not found');
    err.status = 404;
    return res.status(err.status).json({
      error: err.message
    });
  });

  app.use(function (err, req, res) {
    logger.error('Internal error in watch processor: ', err);
    return res.status(err.status || 500).json({
      error: err.message
    });
  });

  return app;
}

function setupMiddlewares(app) {
  //  For logging each requests
  app.use(morgan('dev'));
  const bodyParser = require('body-parser');
  const expressSession = require('express-session');
  const compression = require('compression');
  const favicon = require('serve-favicon');

  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config.js');
  const webpackCompiler = webpack(webpackConfig);

  app.use(favicon(path.join(__dirname, '../', 'client', 'favicon.ico')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(expressSession({secret: 'prakriya'}));
  app.use(auth.initialize());
  app.use(flash());
  app.use(compression());

  app.use(webpackHotMiddleware(webpackCompiler));
  app.use(webpackDevMiddleware(webpackCompiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      stats: {
          colors: true
      },
      watchOptions: {
          aggregateTimeout: 300,
          poll: 1000
      }
  }));

  return app;
}

function setupWebpack(app) {
  if (CONFIG.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    const webpackConfig = require('../webpack.config.js');
    const webpackCompiler = webpack(webpackConfig);

    app.use(webpackHotMiddleware(webpackCompiler));
    app.use(webpackDevMiddleware(webpackCompiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    }));
  }
  return app;
}

function setupMongooseConnections() {
  mongoose.connect(CONFIG.MONGO.mongoURL);

  mongoose.connection.on('connected', function () {
    logger.debug('Mongoose is now connected to ', CONFIG.MONGO.mongoURL);
    const ControlsModel = require('../models/accesscontrols.js');
    const RoleModel = require('../models/roles.js');
    const UserModel = require('../models/users.js');
    CONFIG.BASEDATA.ACCESS_CONTROLS.map(function (controlObj) {
      let saveControl = new ControlsModel(controlObj);
      saveControl.save(function (err, control) {
        if(!err) {
          logger.info('Access Control added', control.name);
        }
      });
    });
    let saveRole = new RoleModel(CONFIG.BASEDATA.ADMIN_ROLE);
    saveRole.save(function (err, role) {
      if(!err) {
        logger.info('Role added', role.name);
      }
    });
    let saveUser = new UserModel(CONFIG.BASEDATA.ADMIN_USER);
    saveUser.save(function (err, user) {
      if(!err) {
        logger.info('User added', user.name);
      }
    });
  });

  mongoose.connection.on('error', function (err) {
    logger.error('Error in Mongoose connection: ', err);
  });

  mongoose.connection.on('disconnected', function () {
    logger.debug('Mongoose is now disconnected..!');
  });

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      logger.info(
        'Mongoose disconnected on process termination'
        );
      process.exit(0);
    });
  });
}

// App Constructor function is exported
module.exports = {
  createApp: createApp,
  setupStaticRoutes: setupStaticRoutes,
  setupRestRoutes: setupRestRoutes,
  setupMiddlewares: setupMiddlewares,
  setupMongooseConnections: setupMongooseConnections,
  setupWebpack: setupWebpack
};
