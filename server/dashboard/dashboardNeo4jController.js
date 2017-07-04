const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
  neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {encrypted: false});

// Adding a cadet
let addCadet = function(cadetObj, successCB, errorCB) {
	
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
      successCB(cadetObj);
    })
    .catch(function(err) {
      errorCB(err);
    });
}


// Course Management

let addCourse = function (CourseObj, successCB, errorCB) {
  logger.info(CourseObj);
  let query = `MERGE (c:Course{ID:'${CourseObj.ID}',Name:'${CourseObj.Name}',
  Mode:'${CourseObj.Mode}',Duration:${CourseObj.Duration},History:'${CourseObj.History}',
  Removed:${CourseObj.Removed}}) with c as course
  UNWIND ${JSON.stringify(CourseObj.Skills)} as skill
  MERGE (n:Skill{Name:skill})
  create (n)<-[:includes_a]-(course);`;
  let session = driver.session();
    session.run(query).then(function (resultObj, err) {
      session.close();
      if(resultObj) {
        logger.debug(resultObj);
        successCB();
      } else {
       errorCB(err);
      }
    });
};

let getCourses = function (successCB, errorCB) {
  let query = `MATCH (courses:Course),(courses)-[:includes_a]->(s:Skill) return courses, collect(s.Name) as skills`;
  let session = driver.session();
  session.run(query).then(function (resultObj, err) {
    session.close();
      let courseArray = [];
      for(let i = 0; i < resultObj.records.length; i++) {
        let result = resultObj.records[i];
        if(result._fields.length === 2)
        {
          courseArray.push(result._fields[0].properties);
          courseArray[i].Skills = result._fields[1];
          courseArray[i].Assignments = [];
          courseArray[i].Schedule = [];
        }
      }
      if(err) {
        errorCB('Error');
      } else {
        logger.debug(courseArray);
        successCB(courseArray);
      }
  });
};

module.exports = {
	addCadet: addCadet,
  addCourse: addCourse,
  getCourses: getCourses,
}
