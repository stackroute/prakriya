const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
  neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {encrypted: false});

/**********************************************
************ Candidate management *************
**********************************************/

// Add cadet

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

  let session = driver.session();

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

let getCadets = function(successCB, errorCB) {
  let session = driver.session();
  let query  = `MATCH (n: ${graphConsts.NODE_CANDIDATE}) return n`;
  session.run(query)
    .then(function(resultObj) {
      session.close();
      let cadets = [];

      for(let i = 0; i < resultObj.records.length; i++) {
        let result = resultObj.records[i];
        logger.debug('Result obj from neo4j', result._fields);
          cadets.push(result._fields[0].properties);
      }
      successCB(cadets);
    })
    .catch(function (err) {
      errorCB(err);
    })
}


/**********************************************
************** Course management **************
**********************************************/

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

  let updateCourse = function (CourseObj, successCB, errorCB) {
  let query = `MATCH (c:Course{ID:'${CourseObj.ID}'})-[r:includes_a]->()
      delete r
      set c.Name = '${CourseObj.Name}',
      c.Mode = '${CourseObj.Mode}',c.Duration = ${CourseObj.Duration},
      c.History = '${CourseObj.History}',
      c.Removed = ${CourseObj.Removed}
      with c as course
      UNWIND ${JSON.stringify(CourseObj.Skills)} as skill
      MERGE (n:Skill{Name:skill})
      MERGE (n)<-[:includes_a]-(course);`
      let session = driver.session();
         session.run(query).then(function (resultObj, err) {
             session.close();
           if(err) {
             errorCB('Error');
           } else {
             successCB('success');
            }
           });
  };

/**********************************************
************ Product management *************
**********************************************/

// adding a new product
let addProduct = function (projectObj, successCB, errorCB) {

   let product = {};
   product.product = projectObj.product;
   product.description = projectObj.description || '';

   let version = {};
   version.name = projectObj.version[0].name;
   version.description = projectObj.version[0].description || '';
   // version.wave = projectObj.version[0].wave;
   // version.members = projectObj.version[0].members;
   version.skills = projectObj.version[0].skills;
   version.addedBy = projectObj.version[0].addedBy;
   version.addedOn = projectObj.version[0].addedOn;
   version.updated = projectObj.version[0].updated;

   let session = driver.session();

   logger.debug("obtained connection with neo4j");

   let query  =
     `CREATE
     (product:${graphConsts.NODE_PRODUCT}
       {
        name: '${product.product}',
        description: '${product.description}'
       }
     )
     -[:${graphConsts.REL_HAS}]->
     (version:${graphConsts.NODE_VERSION}
       {
        name: '${version.name}',
        description: '${version.description}',
        addedOn: '${version.addedOn}',
        addedBy: '${version.addedBy}',
        updated: '${version.updated}'
       }
     )
     WITH version AS version
     UNWIND ${JSON.stringify(version.skills)} AS skillname
     MERGE (skill:${graphConsts.NODE_SKILL} {Name: skillname})
     MERGE (version) -[:${graphConsts.REL_INCLUDES}]-> (skill)
     `;

   session.run(query)
     .then(function(result) {
       logger.debug('Result from the neo4j', result)

       // Completed!
       session.close();
       successCB(projectObj);
     })
     .catch(function(err) {
       errorCB(err);
     });
  };

  // adding a version
  let addVersion = function (name, versionObj, successCB, errorCB) {

     let productName = name;

     let version = {};
     version.name = versionObj.name;
     version.description = versionObj.description || '';
     // version.wave = versionObj.wave;
     // version.members = versionObj..members;
     version.skills = versionObj.skills;
     version.addedBy = versionObj.addedBy;
     version.addedOn = versionObj.addedOn;
     version.updated = versionObj.updated;

     let session = driver.session();

     logger.debug("obtained connection with neo4j");

     let query  =
       `
       CREATE
       (version:${graphConsts.NODE_VERSION}
         {
           name: '${version.name}',
           description: '${version.description}',
           addedOn: '${version.addedOn}',
           addedBy: '${version.addedBy}',
           updated: '${version.updated}'
         }
       )
       WITH version AS version
       MERGE (product:${graphConsts.NODE_PRODUCT} {name: '${productName}'})
       MERGE (version) <-[:${graphConsts.REL_HAS}]- (product)
       WITH version AS version
       UNWIND ${JSON.stringify(version.skills)} AS skillname
       MERGE (skill:${graphConsts.NODE_SKILL} {Name: skillname})
       MERGE (version) -[:${graphConsts.REL_INCLUDES}]-> (skill)
       `;

     session.run(query)
       .then(function(result) {
         logger.debug('Result from the neo4j', result)

         // Completed!
         session.close();
         successCB(versionObj);
       })
       .catch(function(err) {
         errorCB(err);
       });
  };


  module.exports = {
    addCadet,
    getCadets,
    addCourse,
    getCourses,
    updateCourse,
    addProduct,
    addVersion
  }
