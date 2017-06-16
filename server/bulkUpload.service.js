const mongoose = require('mongoose');
const logger = require('./../applogger');
const uploadCandidates = require('./upload/uploadCandidates');
const CONFIG = require('../config');

let setupMongooseConnections = function () {
  mongoose.connect(CONFIG.MONGO.mongoURL);

  mongoose.connection.on('connected', function () {
    logger.debug('Mongoose is now connected to ', CONFIG.MONGO.mongoURL);
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
};

let welcome = function () {
  process.stdout.write('\n=========== Bulk Upload ===========\n');
};

let startBulkUpload = function () {
	welcome();

	setupMongooseConnections();

	uploadCandidates.registerCandidates();
};

startBulkUpload();
