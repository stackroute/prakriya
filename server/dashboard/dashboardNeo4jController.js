const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
  neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {encrypted: false});

let addCadet = function(cadetObj) {
	
	let promise = new Promise(function(resolve, reject) {

		let cadet = {};
		cadet.EmployeeID = cadetObj.EmployeeID || '';
		cadet.EmployeeName = cadetObj.EmployeeName || '';
		cadet.EmailID = cadetObj.EmailID || '';
		cadet.AltEmail = cadetObj.AltEmail || '';
		cadet.Contact = cadetObj.Contact || '';
		cadet.DigiThonQualified = cadetObj.DigiThonQualified || '';
		cadet.DigiThonPhase = cadetObj.DigiThonPhase || '';
		cadet.DigiThonScore = cadetObj.DigiThonScore || '';
		cadet.CareerBand = cadetObj.CareerBand || '';
		cadet.WorkExperience = cadetObj.WorkExperience || '';
		cadet.PrimarySupervisor = cadetObj.PrimarySupervisor || '';
		cadet.ProjectSupervisor = cadetObj.ProjectSupervisor || '';
		cadet.Selected = cadetObj.Selected || '';
		cadet.Remarks = cadetObj.Remarks || '';

		logger.debug("Now proceeding to add a cadet", cadetObj);

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query  = 
    	`CREATE (n: ${graphConsts.NODE_CANDIDATE}
    	{
    		EmployeeID: '${cadet.EmployeeID}',
    		EmployeeName: '${cadet.EmployeeName}',
    		EmailID: '${cadet.EmailID}',
    		AltEmail: '${cadet.AltEmail}',
    		Contact: '${cadet.Contact}',
    		DigiThonQualified: '${cadet.DigiThonQualified}',
    		DigiThonPhase: '${cadet.DigiThonPhase}',
    		DigiThonScore: '${cadet.DigiThonScore}',
    		CareerBand: '${cadet.CareerBand}',
    		WorkExperience: '${cadet.WorkExperience}',
    		PrimarySupervisor: '${cadet.PrimarySupervisor}',
    		ProjectSupervisor: '${cadet.ProjectSupervisor}',
    		Selected: '${cadet.Selected}',
    		Remarks: '${cadet.Remarks}'
    	}) return n`;

    session.run(query)
      .then(function(result) {
        logger.debug('Result from the neo4j', result) 

        // Completed!
        session.close();
        resolve(cadetObj);
      })
      .catch(function(err) {
        reject(err);
      });
	});

	return promise;
}

module.exports = {
	addCadet: addCadet
}