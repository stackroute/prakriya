const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
  neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {encrypted: false});