const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL, neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {encrypted: false});

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

  let query = `CREATE (n: ${graphConsts.NODE_CANDIDATE}
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

  session.run(query).then(function(result) {
    logger.debug('Result from the neo4j', result)

    // Completed!
    session.close();
    successCB(cadetObj);
  }).catch(function(err) {
    errorCB(err);
  });
}

let getCadets = function(successCB, errorCB) {
  let session = driver.session();
  let query = `MATCH (n: ${graphConsts.NODE_CANDIDATE}) return n`;
  session.run(query).then(function(resultObj) {
    session.close();
    let cadets = [];

    for (let i = 0; i < resultObj.records.length; i++) {
      let result = resultObj.records[i];
      logger.debug('Result obj from neo4j', result._fields);
      cadets.push(result._fields[0].properties);
    }
    successCB(cadets);
  }).catch(function(err) {
    errorCB(err);
  })
}

/**********************************************
************** Course management **************
**********************************************/

// Course Management

let addCourse = function(CourseObj, successCB, errorCB) {
  logger.info(CourseObj);
  let query = `MERGE (c:Course{ID:'${CourseObj.ID}',Name:'${CourseObj.Name}',
  Mode:'${CourseObj.Mode}',Duration:${CourseObj.Duration},History:'${CourseObj.History}',
  Removed:${CourseObj.Removed}}) with c as course
  UNWIND ${JSON.stringify(CourseObj.Skills)} as skill
  MERGE (n:Skill{Name:skill})
  create (n)<-[:includes_a]-(course);`;
  let session = driver.session();
  session.run(query).then(function(resultObj, err) {
    session.close();
    if (resultObj) {
      logger.debug(resultObj);
      successCB();
    } else {
      errorCB(err);
    }
  });
};

let getCourses = function(successCB, errorCB) {
  let query = `MATCH (courses:Course),(courses)-[:includes_a]->(s:Skill) return courses, collect(s.Name) as skills`;
  let session = driver.session();
  session.run(query).then(function(resultObj, err) {
    session.close();
    let courseArray = [];
    for (let i = 0; i < resultObj.records.length; i++) {
      let result = resultObj.records[i];
      if (result._fields.length === 2) {
        courseArray.push(result._fields[0].properties);
        courseArray[i].Skills = result._fields[1];
        courseArray[i].Assignments = [];
        courseArray[i].Schedule = [];
      }
    }
    if (err) {
      errorCB('Error');
    } else {
      logger.debug(courseArray);
      successCB(courseArray);
    }
  });
};

let updateCourse = function(CourseObj, successCB, errorCB) {
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
  session.run(query).then(function(resultObj, err) {
    session.close();
    if (err) {
      errorCB('Error');
    } else {
      successCB('success');
    }
  });
};
// let getWave = function(waveID, successCB, errorCB) {
//   logger.debug('In get Wave', waveID);
//   let query = `MATCH(n:${graphConsts.NODE_WAVE}) WHERE n.WaveID='${waveID}' RETURN n`;
//   let session = driver.session();
//   session.run(query).then(function(resultObj) {
//     session.close();
//     if (resultObj) {
//       logger.debug(resultObj);
//     } else {
//       errorCB('Error');
//     }
//   });
// };
// let getWaveIDs = function(successCB, errorCB) {
//   let query = `MATCH(n:${graphConsts.NODE_WAVE}) RETURN DISTINCT n.WaveID`;
//   let session = driver.session();
//   session.run(query).then(function(resultObj) {
//     session.close();
//     if (resultObj) {
//       logger.debug(resultObj);
//     } else {
//       errorCB('Error');
//     }
//   });
// };
// let getWaveSpecificCandidates = function(waveID, successCB, errorCB) {
//   let query = `MATCH(n:${graphConsts.NODE_WAVE}) WHERE n.WaveID='${waveID}' RETURN n.EmployeeName`;
//   let session = driver.session();
//   session.run(query).then(function(resultObj) {
//     session.close();
//     if (resultObj) {
//       logger.debug(resultObj);
//     } else {
//       errorCB('Error');
//     }
//   });
// };
// let getWaveObject = function(waveID, successCB, errorCB) {
//   let query = `MATCH(n:${graphConsts.NODE_WAVE}) WHERE n.WaveID='${waveID}' RETURN n`;
//   let session = driver.session();
//   session.run(query).then(function(resultObj) {
//     session.close();
//     if (resultObj) {
//       logger.debug(resultObj);
//     } else {
//       errorCB('Error');
//     }
//   });
// };
let getWaves = function(successCB, errorCB) {
  let query = `MATCH(n:${graphConsts.NODE_WAVE}) RETURN n`;
  let session = driver.session();
  session.run(query).then(function(resultObj) {
    session.close();
    if (resultObj) {
      let waves = []
      resultObj.records.map(function(res){
        waves.push(res._fields[0].properties)
      })
      successCB(waves);
    } else {
      errorCB('Error');
    }
  });
};
// let getCadetsOfWave = function(waveID, successCB, errorCB) {
//   let query = `MATCH(n:${graphConsts.NODE_WAVE}) WHERE n.WaveID='${waveID}' RETURN n`;
//   let session = driver.session();
//   session.run(query).then(function(resultObj) {
//     session.close();
//     if (resultObj) {
//       logger.debug(resultObj);
//     } else {
//       errorCB('Error');
//     }
//   });
// };
// let updateWave = function(waveObj, successCB, errorCB) {
//   let query = `MATCH(n:${graphConsts.NODE_WAVE}) WHERE n.WaveID='${waveObj.waveID}'
//                SET n.WaveID = '${waveObj.WaveID}'
//                   n.WaveNumber = '${waveObj.WaveNumber}'
//                   n.Location = '${waveObj.Location}'
//                   n.StartDate = '${waveObj.StartDate}'
//                   n.EndDate = '${waveObj.EndDate}'
//                   n.Sessions = '${waveObj.Sessions}'
//                   n.Cadets = '${waveObj.Cadets}'
//                   n.CourseNames = '${waveObj.CourseNames}'
//                RETURN n`;
//   let session = driver.session();
//   session.run(query).then(function(resultObj) {
//     session.close();
//     if (resultObj) {
//       logger.debug(resultObj);
//     } else {
//       errorCB('Error');
//     }
//   });
// };
// let getCoursesForWave = function(waveID, successCB, errorCB) {
//   let query = `MATCH(n:${graphConsts.NODE_WAVE}) WHERE n.WaveID='${waveID}' RETURN n.CourseNames`;
//   let session = driver.session();
//   session.run(query).then(function(resultObj) {
//     session.close();
//     if (resultObj) {
//       logger.debug(resultObj);
//     } else {
//       errorCB('Error');
//     }
//   });
let addWave = function (waveObj, successCB, errorCB) {
  	let userObj = {};
    userObj.WaveID = waveObj.WaveID ||'',
    userObj.WaveNumber = waveObj.WaveNumber ||'',
    userObj.Location = waveObj.Location ||'',
    userObj.StartDate = waveObj.StartDate ||'',
    userObj.EndDate = waveObj.EndDate ||'',
    userObj.Sessions  = waveObj.Sessions  ||'',
    userObj.Cadets  = waveObj.Cadets ||'',
    userObj.CourseNames  = waveObj.CourseNames ||''
    let session = driver.session();

    let query = `CREATE  (wave:${graphConsts.NODE_WAVE}
    	{
          WaveID: '${userObj.WaveID}',
          WaveNumber: '${userObj.WaveNumber}',
          Location: '${userObj.Location}',
          StartDate: '${userObj.StartDate}',
          EndDate: '${userObj.EndDate}'
        })
        WITH wave AS wave
        UNWIND ${JSON.stringify(userObj.Cadets)} AS empID
        MERGE (candidate:${graphConsts.NODE_CANDIDATE} {EmployeeID: empID})
        MERGE (candidate) -[:BELONGSTO]-> (wave)`;

      session.run(query).then(function(result) {
        logger.debug('Result from the neo4j', result)
        session.close();
        successCB(userObj);
      }).catch(function(err) {
        errorCB(err);
      });
    }
let deleteWave = function (waveObj, successCB, errorCB) {
  console.log(waveObj,"waveObj")
    let query = `MATCH (n:${graphConsts.NODE_WAVE}{WaveID:'${waveObj.WaveID}'}) DETACH DELETE n `;
    let session = driver.session();
    session.run(query).then(function(resultObj) {
      session.close();
      if (resultObj) {
        logger.debug(resultObj)
      } else {
        errorCB('Error');
      }
    });
    successCB();
  }
// let updateCadetWave = function (cadets, waveID, successCB, errorCB) {
//   let userObj={}
//   cadets.map(function (cadet) {
//   let query=`MATCH(n:${graphConsts.NODE_WAVE})
//              WHERE n.EmployeeID='${cadet}'
//              SET n.Wave = waveID`;
//    let session = driver.session();
//    session.run(query).then(function(resultObj) {
//      session.close();
//      if (resultObj) {
//        logger.debug(resultObj);
//        userObj.name = user.EmployeeName;
//        userObj.email = user.EmailID;
//        userObj.username = user.EmailID.split('@')[0];
//        userObj.password = CONFIG.DEFAULT_PASS;
//        userObj.role = 'candidate';
//        adminMongoController.addUser(userObj, function (savedUser) {
//          logger.info('New User created: ', savedUser);
//        }, function (Err) {
//          logger.error('Error in creating user', Err);
//        });
//      }
//       else {
//        errorCB('Error');
//      }
//    })
//  }}
//  let getActiveWaves = function (successCB, errorCB) {
//     let todayDate = new Date();
//     let today = todayDate.getFullYear()*10000 + '' + todayDate.getMonth()*100 + '' + todayDate.getDay();
//     let query = `MATCH(n) WHERE toInt(n.StartDate) <= today AND toInt(n.EndDate) >= today`;
//       let session = driver.session();
//          session.run(query).then(function (resultObj) {
//              session.close();
//              if(resultObj) {
//              logger.debug(resultObj);
//                resultObj.map(function(obj)
//                       {
//
//                       })
//            } else {
//                errorCB('Error');
//              }
//            });
//     };


  module.exports = {
    addCadet,
    getCadets,
    addCourse,
    getCourses,
    updateCourse,
    getWaves,
    addWave,
    deleteWave

  }
  // getWave,
  // getWaveIDs,
  // getWaveSpecificCandidates,
  // getWaveObject,
  // getWaves,
  // getCadetsOfWave,
  // updateWave,
  // getCoursesForWave,
  // addWave,
  // deleteWave,
  // updateCadetWave,
  // getActiveWaves
