const mongoose = require('mongoose');
const logger = require('log4js').getLogger();
const uploadCandidates = require('./upload/uploadCandidates');

let setupMongooseConnections = function() {
  mongoose.connect('mongodb://localhost:27017/prakriya');

  mongoose.connection.on('connected', function() {
    logger.debug('Mongoose is now connected to ', 'mongodb://localhost:27017/prakriya');
  });

  mongoose.connection.on('error', function(err) {
    logger.error('Error in Mongoose connection: ', err);
  });

  mongoose.connection.on('disconnected', function() {
    logger.debug('Mongoose is now disconnected..!');
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      logger.info(
        'Mongoose disconnected on process termination'
      );
      process.exit(0);
    });
  });
}

let welcome = function() {
  process.stdout.write('\n=========== Bulk Upload ===========\n');
}

let startBulkUpload = function () {

	welcome();

	setupMongooseConnections();

	uploadCandidates.registerCandidates();

}

startBulkUpload();