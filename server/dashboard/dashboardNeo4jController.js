const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
  neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {encrypted: false});

// course Management

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

  module.exports = {
    addCourse,
    getCourses,
    updateCourse
  }
