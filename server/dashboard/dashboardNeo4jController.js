const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const adminMongoController = require('../admin/adminMongoController.js');
const graphConsts = require('./../common/graphConstants');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL, neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {encrypted: false});

let deleteDanglingSkills = function() {
  let query = `MATCH (n:${graphConsts.NODE_SKILL}) where SIZE((n)--())=0 DELETE n`;
  let session = driver.session();
  session.run(query).then(function(result, err) {
    session.close();
  });
};

/**********************************************
************ Candidate Management *************
**********************************************/

// adding cadet
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
  cadet.Billability = cadetObj.Billability || '';
  cadet.PrimarySupervisor = cadetObj.PrimarySupervisor || '';
  cadet.ProjectSupervisor = cadetObj.ProjectSupervisor || '';
  cadet.Selected = cadetObj.Selected || '';
  cadet.Remarks = cadetObj.Remarks || ''

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
      Billability: '${cadet.Billability}',
  		PrimarySupervisor: '${cadet.PrimarySupervisor}',
  		ProjectSupervisor: '${cadet.ProjectSupervisor}',
  		Selected: '${cadet.Selected}',
  		Remarks: '${cadet.Remarks}'
  	}) return n`;
  session.run(query).then(function(result) {
    session.close();
    successCB(cadetObj);
  }).catch(function(err) {
    errorCB(err);
  });
}

// updating a cadet
let updateCadet = function(cadetObj, successCB, errorCB) {

  let cadet = {};

  cadet.EmployeeID = cadetObj.EmployeeID || '';
  cadet.AltEmail = cadetObj.AltEmail || '';
  cadet.Contact = cadetObj.Contact || '';
  cadet.CareerBand = cadetObj.CareerBand || '';
  cadet.WorkExperience = cadetObj.WorkExperience || '';
  cadet.Billability = cadetObj.Billability || '';
  cadet.PrimarySupervisor = cadetObj.PrimarySupervisor || '';
  cadet.ProjectSupervisor = cadetObj.ProjectSupervisor || '';
  cadet.Selected = cadetObj.Selected || '';
  cadet.Remarks = cadetObj.Remarks || '';

  let session = driver.session();

  let query = `MATCH (n: ${graphConsts.NODE_CANDIDATE}{EmployeeID: '${cadet.EmployeeID}'})
    SET
      n.AltEmail = '${cadet.AltEmail}',
      n.Contact = '${cadet.Contact}',
      n.CareerBand = '${cadet.CareerBand}',
      n.WorkExperience = '${cadet.WorkExperience}',
      n.Billability = '${cadet.Billability}',
      n.PrimarySupervisor = '${cadet.PrimarySupervisor}',
      n.ProjectSupervisor = '${cadet.ProjectSupervisor}',
      n.Selected = '${cadet.Selected}',
      n.Remarks = '${cadet.Remarks}'
    return n`;

    session.run(query)
    .then(function(result) {
      session.close();
      successCB(cadetObj);
    })
    .catch(function(err) {
      errorCB(err);
    });
}

// updating cadets
let updateCadets = function(cadetArr, successCB, errorCB) {
  let count = 0;
  cadetArr.map(function(cadet) {
    updateCadet(cadet, function(cadetObj) {
      count = count + 1;
      if (count == cadetArr.length) {
        successCB()
      }
    }, function(err) {
      errorCB(err);
    })
  })
}

// fetching all the cadets
let getCadets = function(successCB, errorCB) {
  let session = driver.session();
  let query = `MATCH (n: ${graphConsts.NODE_CANDIDATE}) return n`;
  session.run(query).then(function(resultObj) {
    session.close();
    let cadets = [];
    for (let i = 0; i < resultObj.records.length; i++) {
      let result = resultObj.records[i];
      cadets.push(result._fields[0].properties);
    }
    successCB(cadets);
  }).catch(function(err) {
    errorCB(err);
  })
}

// fetching candidate logged in
let getCadet = function(email, successCB, errorCB) {
  let session = driver.session();
  let query = `MATCH (n: ${graphConsts.NODE_CANDIDATE}{EmailID:'${email}'})-[:${graphConsts.REL_BELONGS_TO}]->(w: '${graphConsts.NODE_WAVE}') return n`;
  session.run(query).then(function(resultObj) {
    session.close();
    console.log('done');
    successCB(resultObj.records[0]._fields[0].properties);
  }).catch(function(err) {
    errorCB(err);
  })
}

// fetching all the new cadets
let getNewCadets = function(successCB, errorCB) {
  let session = driver.session();
  let query = `MATCH (n: ${graphConsts.NODE_CANDIDATE}) WHERE NOT
    (n)-[:${graphConsts.REL_BELONGS_TO}]->(:${graphConsts.NODE_WAVE})
    return n`;
  session.run(query)
    .then(function(resultObj) {
      session.close();
      let cadets = [];

      for(let i = 0; i < resultObj.records.length; i++) {
        let result = resultObj.records[i];
          cadets.push(result._fields[0].properties);
      }
      successCB(cadets);
    })
    .catch(function (err) {
      errorCB(err);
    })
}

/**********************************************
************** Course Management **************
**********************************************/

// adding a course
let addCourse = function(CourseObj, successCB, errorCB) {
  logger.info(CourseObj);
  let query = `MERGE (c:${graphConsts.NODE_COURSE}{ID:'${CourseObj.ID}',Name:'${CourseObj.Name}',
  Mode:'${CourseObj.Mode}',Duration:${CourseObj.Duration},History:'${CourseObj.History}',
  Removed:${CourseObj.Removed}}) WITH c AS course
  UNWIND ${JSON.stringify(CourseObj.Skills)} AS skill
  MERGE (n:${graphConsts.NODE_SKILL}{Name:skill})
  MERGE (n)<-[:${graphConsts.REL_INCLUDES}]-(course);`;
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
  let query = `MATCH (courses:${graphConsts.NODE_COURSE})
  OPTIONAL MATCH (courses)-[:${graphConsts.REL_INCLUDES}]->(s:${graphConsts.NODE_SKILL})
  OPTIONAL MATCH (courses)-[:${graphConsts.REL_HAS}]->(a:${graphConsts.NODE_ASSIGNMENT})-[:${graphConsts.REL_INCLUDES}]->(aSkill:${graphConsts.NODE_SKILL})
  with collect(aSkill.Name) as assgSkill, a as a, courses as courses,s as s
  OPTIONAL MATCH (courses)-[:${graphConsts.REL_HAS}]->(se:${graphConsts.NODE_SESSION})
  optional match (se)-[:${graphConsts.REL_INCLUDES}]->(seSkill:${graphConsts.NODE_SKILL})
  with collect(seSkill.Name) as sessSkill, assgSkill as assgSkill, a as a, courses as courses,s as s,se as se
  return courses, collect(distinct s.Name) as skills,COLLECT(distinct {a: a, b: assgSkill}) as assg,COLLECT(distinct {a: se, b: sessSkill}) as session`;
  let session = driver.session();
  session.run(query).then(function(resultObj, err) {
    session.close();
    let courseArray = [];
    for (let i = 0; i < resultObj.records.length; i++) {
      let result = resultObj.records[i];
      courseArray.push(result._fields[0].properties);
      courseArray[i].Skills = result._fields[1];
      if (result._fields[2][0].a === null) {
        courseArray[i].Assignments = [];
      } else {
        let Assignments = [];
        for (let j = 0; j < result._fields[2].length; j++) {
          Assignments.push(result._fields[2][j].a.properties);
          Assignments[j].Skills = result._fields[2][j].b;
        }
        courseArray[i].Assignments = Assignments
      }
      if (result._fields[3][0].a === null) {
        courseArray[i].Schedule = [];
      } else {
        let Session = [];
        for (let j = 0; j < result._fields[3].length; j++) {
          Session.push(result._fields[3][j].a.properties);
          Session[j].Skills = result._fields[3][j].b;
        }
        courseArray[i].Schedule = Session
      }
    }
    if (err) {
      errorCB('Error');
    } else {
      successCB(courseArray);
    }
  });
};

let updateCourse = function(CourseObj, edit, successCB, errorCB) {
  if (edit === 'edit') {
    let query = `MATCH (c:${graphConsts.NODE_COURSE}{ID:'${CourseObj.ID}'})-[r:${graphConsts.REL_INCLUDES}]->()
          delete r
          set c.Name = '${CourseObj.Name}',
          c.Mode = '${CourseObj.Mode}',c.Duration = ${CourseObj.Duration},
          c.History = '${CourseObj.History}',
          c.Removed = ${CourseObj.Removed}
          with c as course
          UNWIND ${JSON.stringify(CourseObj.Skills)} as skill
          MERGE (n:${graphConsts.NODE_SKILL}{Name:skill})
          MERGE (n)<-[:${graphConsts.REL_INCLUDES}]-(course);`
    let session = driver.session();
    session.run(query).then(function(resultObj, err) {
      session.close();
      if (err) {
        errorCB('Error');
      } else {
        let query1 = `MATCH (n:${graphConsts.NODE_SKILL}) where SIZE((n)--())=0 DELETE n`;
        let session1 = driver.session();
        session1.run(query1).then(function(resultObj, err) {
          session1.close();
        });
        successCB('success');
      }
    });
  } else if (edit === 'assignment') {
    let assignment = CourseObj.Assignments[CourseObj.Assignments.length - 1]
    let query = `MATCH (c:${graphConsts.NODE_COURSE}{ID:'${CourseObj.ID}'})
        with c as course
        MERGE (assg:${graphConsts.NODE_ASSIGNMENT}{Name:'${assignment.Name}',
        Description: '${assignment.Description}',
        Week: ${assignment.Week},
        Duration: ${assignment.Duration}})
        with assg as assg,course as course
        MERGE (assg)<-[:${graphConsts.REL_HAS}]-(course)
        with assg as assg
        UNWIND ${JSON.stringify(assignment.Skills)} as skill
        MERGE (n:${graphConsts.NODE_SKILL}{Name:skill})
        MERGE (n)<-[:${graphConsts.REL_INCLUDES}]-(assg);
        `
    let session = driver.session();
    session.run(query).then(function(resultObj, err) {
      session.close();
      if (err) {
        errorCB('Error');
      } else {
        successCB('success');
      }
    });
  } else if (edit === 'schedule') {
    let schedule = CourseObj.Schedule[CourseObj.Schedule.length - 1]
    let query = ``;
    if (schedule.Skills.length >= 1) {
      query = `MATCH (c:${graphConsts.NODE_COURSE}{ID:'${CourseObj.ID}'})
              with c as course
              MERGE (schedule:${graphConsts.NODE_SESSION}{Name:'${schedule.Name}',
              Description: '${schedule.Description}',
              Day: ${schedule.Day}})
              with schedule as schedule,course as course
              MERGE (schedule)<-[:${graphConsts.REL_HAS}]-(course)
              with schedule as schedule
              UNWIND ${JSON.stringify(schedule.Skills)} as skill
              MERGE (n:${graphConsts.NODE_SKILL}{Name:skill})
              MERGE (n)<-[:${graphConsts.REL_INCLUDES}]-(schedule);
              `
    } else {
      query = `MATCH (c:${graphConsts.NODE_COURSE}{ID:'${CourseObj.ID}'})
              with c as course
              MERGE (schedule:${graphConsts.NODE_SESSION}{Name:'${schedule.Name}',
              Description: '${schedule.Description}',
              Day: ${schedule.Day}})
              with schedule as schedule,course as course
              MERGE (schedule)<-[:${graphConsts.REL_HAS}]-(course);
              `
    }
    let session = driver.session();
    session.run(query).then(function(resultObj, err) {
      session.close();
      if (err) {
        errorCB('Error');
      } else {
        successCB('success');
      }
    });
  }
};

let deleteOrRestoreCourse = function(CourseObj, type, successCB, errorCB) {
  if (type === 'delete') {
    let query = `MATCH (c:${graphConsts.NODE_COURSE}{ID:'${CourseObj.ID}'})-[r:${graphConsts.REL_INCLUDES}]->()
          set c.Removed = true
          return c`;
    let session = driver.session();
    session.run(query).then(function(resultObj, err) {
      session.close();
      if (err) {
        errorCB('Error');
      } else {
        successCB('success');
      }
    });
  } else {
    let query = `UNWIND ${JSON.stringify(CourseObj)} as id
      MATCH (c:${graphConsts.NODE_COURSE}{ID:id})-[r:${graphConsts.REL_INCLUDES}]->()
      set c.Removed = false`;
    let session = driver.session();
    session.run(query).then(function(resultObj, err) {
      session.close();
      if (err) {
        errorCB('Error');
      } else {
        successCB('success');
      }
    });
  }
}

let deleteAssignmentOrSchedule = function(obj, course, type, successCB, errorCB) {
  if (type === 'assignment') {
    let query = `MATCH (s:${graphConsts.NODE_ASSIGNMENT}{Name:'${obj.Name}'})<-[:${graphConsts.REL_HAS}]-(c:${graphConsts.NODE_COURSE}) return count(c);`
    let session = driver.session();
    session.run(query).then(function(resultObj, err) {
      session.close();
      if (err) {
        errorCB('Error');
      } else {
        if (resultObj.records[0]._fields[0].low <= 1) {
          let query1 = `MATCH (s:${graphConsts.NODE_ASSIGNMENT}{Name:'${obj.Name}'}) detach delete s;`
          let session1 = driver.session();
          session1.run(query1).then(function(resultObj, err) {
            session1.close();
            if (err) {
              errorCB('Error');
            } else {
              successCB();
            }
          });
        } else {
          let query1 = `MATCH (s:${graphConsts.NODE_ASSIGNMENT}{Name:'${obj.Name}'})<-[r:${graphConsts.REL_HAS}]-(c:${graphConsts.NODE_COURSE}{Name:'${course.Name}'}) delete r`
          let session1 = driver.session();
          session1.run(query1).then(function(resultObj, err) {
            session1.close();
            if (err) {
              errorCB('Error');
            } else {
              successCB();
            }
          })
        }
      }
    });
  } else {
    let query = `MATCH (s:${graphConsts.NODE_SESSION}{Name:'${obj.Name}'})<-[:${graphConsts.REL_HAS}]-(c:${graphConsts.NODE_COURSE}) return count(c);`
    let session = driver.session();
    session.run(query).then(function(resultObj, err) {
      session.close();
      if (err) {
        errorCB('Error');
      } else {
        if (resultObj.records[0]._fields[0].low <= 1) {
          let query1 = `MATCH (s:${graphConsts.NODE_SESSION}{Name:'${obj.Name}'}) detach delete s;`
          let session1 = driver.session();
          session1.run(query1).then(function(resultObj, err) {
            session1.close();
            if (err) {
              errorCB('Error');
            } else {
              successCB();
            }
          })
        } else {
          let query1 = `MATCH (s:${graphConsts.NODE_SESSION}{Name:'${obj.Name}'})<-[r:${graphConsts.REL_HAS}]-(c:${graphConsts.NODE_COURSE}{Name:'${course.Name}'}) delete r`
          let session1 = driver.session();
          session1.run(query1).then(function(resultObj, err) {
            session1.close();
            if (err) {
              errorCB('Error');
            } else {
              successCB();
            }
          })
        }
      }
    });
  }
}

let getCourse = function (courseID, successCB, errorCB) {
  let query = `MATCH (c:${graphConsts.NODE_COURSE}{ID:'${courseID}'})<-[:${graphConsts.REL_HAS}]-(w:${graphConsts.NODE_WAVE}) return c;`
  let session = driver.session();
  session.run(query).then(function(resultObj, err) {
    session.close();
  if (err) {
			errorCB(err);
		}
    successCB(resultObj.records[0]._fields[0].properties);
	});
};


/**********************************************
************ Product Management ***************
**********************************************/

// adding a new product
let addProduct = function(productObj, successCB, errorCB) {

  let product = {};
  product.product = productObj.product;
  product.description = productObj.description || '';

  let version = {};
  version.name = productObj.version[0].name;
  version.description = productObj.version[0].description || '';
  version.wave = productObj.version[0].wave || '';
  version.members = productObj.version[0].members.map(function(member) {
    return member.EmployeeName
  });
  version.skills = productObj.version[0].skills;
  version.addedBy = productObj.version[0].addedBy;
  version.addedOn = productObj.version[0].addedOn;
  version.updated = productObj.version[0].updated;

  let session = driver.session();

  let query = `CREATE
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
        wave: '${version.wave}',
        addedOn: '${version.addedOn}',
        addedBy: '${version.addedBy}',
        updated: '${version.updated}'
       }
     )
     WITH version AS version, product AS product
     UNWIND ${JSON.stringify(version.skills)} AS skillname
     MERGE (skill:${graphConsts.NODE_SKILL} {Name: skillname})
     MERGE (version) -[:${graphConsts.REL_INCLUDES}]-> (skill)
     WITH version AS version, product AS product
     UNWIND ${JSON.stringify(version.members)} AS employeeName
     UNWIND ${JSON.stringify(version.skills)} AS skillname
     MERGE (skill:${graphConsts.NODE_SKILL} {Name: skillname})
     MERGE (employee:${graphConsts.NODE_CANDIDATE} {EmployeeName: employeeName})
     MERGE (skill) <-[:${graphConsts.REL_KNOWS} {rating: 'nil'}]- (employee)
     WITH product AS product
     UNWIND ${JSON.stringify(version.members)} AS employeeName
     MERGE (employee:${graphConsts.NODE_CANDIDATE} {EmployeeName: employeeName})
     MERGE (product) <-[:${graphConsts.REL_WORKEDON} {version: '${version.name}'}]- (employee)
     `;

  session.run(query).then(function(result) {

    // Completed!
    session.close();
    successCB(productObj);
  }).catch(function(err) {
    errorCB(err);
  });
};

// adding a version
let addVersion = function(productName, versionObj, successCB, errorCB) {

  let version = {};
  version.name = versionObj.name;
  version.description = versionObj.description || '';
  version.wave = versionObj.wave || '';
  // version.members = versionObj.members;
  version.skills = versionObj.skills;
  version.addedBy = versionObj.addedBy;
  version.addedOn = versionObj.addedOn;
  version.updated = versionObj.updated;

  let session = driver.session();

  let query = `
       CREATE
       (version:${graphConsts.NODE_VERSION}
         {
           name: '${version.name}',
           description: '${version.description}',
           wave: '${version.wave}',
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

  session.run(query).then(function(result, err) {
    session.close();
    if(err) {
      errorCB(err);
    } else {
      successCB(versionObj);
    }
  }).catch(function(err) {
    errorCB(err);
  });
};

// editing a version
let updateVersion = function (version, successCB, errorCB) {

    console.log('inside update version');

    let session = driver.session();
    let employeeIDs = version.members.map(function(member) {
      return member.EmployeeID
    });

    let query = `
          MATCH (version:${graphConsts.NODE_VERSION} {name: '${version.name}'})
          -[skillsRelation:${graphConsts.REL_INCLUDES}]-> (skill:${graphConsts.NODE_SKILL})
          DELETE skillsRelation
          WITH COLLECT(skill.Name) AS skills, version AS version
          UNWIND (skills) AS skillName
          MATCH (candidate:${graphConsts.NODE_CANDIDATE})
          -[skillsRelation:${graphConsts.REL_KNOWS}]-> (:${graphConsts.NODE_SKILL} {Name: skillName})
          DELETE skillsRelation
          WITH version AS version
          MATCH (candidate:${graphConsts.NODE_CANDIDATE})
          -[productRelation:${graphConsts.REL_WORKEDON} {version: version.name}]-> (:${graphConsts.NODE_PRODUCT})
          DELETE productRelation
          WITH version AS version
          SET version.description='${version.description}',
          version.addedOn='${String(version.addedOn)}',
          version.addedBy='${version.addedBy}',
          version.updated=${version.updated}
          WITH version AS version
          MATCH (product:${graphConsts.NODE_PRODUCT})
          -[:${graphConsts.REL_HAS}]-> (:${graphConsts.NODE_VERSION} {name: version.name})
          WITH version AS version, product AS product
          UNWIND ${JSON.stringify(version.skills)} AS skillname
          MERGE (skill:${graphConsts.NODE_SKILL} {Name: skillname})
          MERGE (version) -[:${graphConsts.REL_INCLUDES}]-> (skill)
          WITH version AS version, product AS product
          UNWIND ${JSON.stringify(employeeIDs)} AS employeeID
          UNWIND ${JSON.stringify(version.skills)} AS skillname
          MERGE (skill:${graphConsts.NODE_SKILL} {Name: skillname})
          MERGE (employee:${graphConsts.NODE_CANDIDATE} {EmployeeID: employeeID})
          MERGE (skill) <-[:${graphConsts.REL_KNOWS} {rating: 'nil'}]- (employee)
          WITH product AS product
          UNWIND ${JSON.stringify(employeeIDs)} AS employeeID
          MERGE (employee:${graphConsts.NODE_CANDIDATE} {EmployeeID: employeeID})
          MERGE (product) <-[:${graphConsts.REL_WORKEDON} {version: '${version.name}'}]- (employee)
         `;

    session.run(query).then(function(result, err) {
      session.close();
      if(err) {
        errorCB(err);
      } else {
        deleteDanglingSkills();
        successCB(version);
      }
    }).catch(function(err) {
      errorCB(err);
    });

};

// deleting a product
let deleteProduct = function(productName, successCB, errorCB) {

  let session = driver.session();

  let query = `
       MATCH (version:${graphConsts.NODE_VERSION})
       <-[:${graphConsts.REL_HAS}]-
       (product:${graphConsts.NODE_PRODUCT} {name: '${productName}'})
       DETACH DELETE version
       DETACH DELETE product
       `;

  session.run(query).then(function(result, err) {
    session.close();
    if(err) {
      errorCB(err);
    } else {
      deleteDanglingSkills();
      successCB(productName);
    }
  }).catch(function(err) {
    errorCB(err);
  });
};

// deleting a version
let deleteVersion = function(versionName, successCB, errorCB) {

  let session = driver.session();

  let query = `
       MATCH (version:${graphConsts.NODE_VERSION} {name: '${versionName}'})
       DETACH DELETE version
       MATCH (candidate:${graphConsts.NODE_CANDIDATE})
       -[relation:${graphConsts.REL_WORKEDON} {version: version.name}]->
       (:${graphConsts.NODE_PRODUCT})
       DELETE relation
       `;

  session.run(query).then(function(result, err) {
    session.close();
    if(err) {
      errorCB(err);
    } else {
      deleteDanglingSkills();
      successCB(versionName);
    }
  }).catch(function(err) {
    errorCB(err);
  });
};

// fetching all products
let getProducts = function(successCB, errorCB) {
  let session = driver.session();

  let query = `
    MATCH (product:${graphConsts.NODE_PRODUCT})
    -[:${graphConsts.REL_HAS}]-> (version:${graphConsts.NODE_VERSION})
    WITH COLLECT(version) AS versions, product AS product
    UNWIND versions AS version
    MATCH (version:${graphConsts.NODE_VERSION} {name: version.name})
    -[:${graphConsts.REL_INCLUDES}]-> (skill:${graphConsts.NODE_SKILL})
    MATCH (candidate:${graphConsts.NODE_CANDIDATE}) -[:${graphConsts.REL_WORKEDON} {version: version.name}]-> (:${graphConsts.NODE_PRODUCT})
    WITH COLLECT(skill.Name) AS skills, version AS version, product AS product,
    COLLECT ({EmployeeID: candidate.EmployeeID, EmployeeName: candidate.EmployeeName}) AS candidates
    WITH COLLECT({
      name: version.name,
      description: version.description,
      wave: version.wave,
      members: candidates,
      skills: skills,
      addedBy: version.addedBy,
      addedOn: version.addedOn,
      updated: version.updated
    }) AS versions, product AS product
    RETURN {
      product: product.name,
      description: product.description,
      version: versions
    }`;

  session.run(query).then(function(resultObj, err) {
    session.close();
    if (err) {
      errorCB('Error');
    } else {
      successCB(resultObj.records[0] ? resultObj.records[0]._fields : []);
    }
  }).catch(function(err) {
    errorCB(err);
  });
};


/**********************************************
************** Wave Management ****************
**********************************************/

// Add a wave
let addWave = function (waveObj, successCB, errorCB) {
  let userObj = {};
  userObj.WaveID = waveObj.WaveID || '',
  userObj.WaveNumber = waveObj.WaveNumber || '',
  userObj.Mode = waveObj.Mode || '',
  userObj.Location = waveObj.Location || '',
  userObj.StartDate = waveObj.StartDate || '',
  userObj.EndDate = waveObj.EndDate || '',
  userObj.Sessions = waveObj.Sessions  || '',
  userObj.Cadets = waveObj.Cadets || '',
  userObj.Course = waveObj.Course || '';

  let session = driver.session();

  let query = `CREATE  (wave:${graphConsts.NODE_WAVE}
    {
      WaveID: '${userObj.WaveID}',
      WaveNumber: '${userObj.WaveNumber}',
      Mode: '${userObj.Mode}',
      Location: '${userObj.Location}',
      StartDate: '${userObj.StartDate}',
      EndDate: '${userObj.EndDate}'
    })
    WITH wave AS wave
    MATCH (course: ${graphConsts.NODE_COURSE}{ID: '${userObj.Course}'})
    WITH wave AS wave, course AS course
    MERGE (wave)-[:${graphConsts.REL_HAS}]->(course)
    WITH wave AS wave
    UNWIND ${JSON.stringify(userObj.Cadets)} AS empID
    MERGE (candidate:${graphConsts.NODE_CANDIDATE} {EmployeeID: empID})
    MERGE (candidate) -[:${graphConsts.REL_BELONGS_TO}]-> (wave)
    RETURN candidate`;
  let count  = 0;
  session.run(query).then(function(result) {
    session.close();
    if(waveObj.Cadets.length > 0) {
      result.records.map(function(record) {
        let userObj = {};
        let cadetObj = record._fields[0].properties;
        userObj.name = cadetObj.EmployeeName;
        userObj.email = cadetObj.EmailID;
        userObj.username = cadetObj.EmailID.split('@')[0];
        userObj.password = config.DEFAULT_PASS;
        userObj.role = 'candidate';
        logger.debug('User obj created', userObj);
        adminMongoController.addUser(userObj, function (savedUser) {
          logger.info('New User Created: ', savedUser);
          count = count+1;
          if(count == waveObj.Cadets.length) {
            successCB(result);
          }
        }, function (err2) {
          logger.error('Error in creating user', err2);
          errorCB(err2);
        });
      })
    }
    else {
      successCB(result);
    }
  }).catch(function(err) {
    errorCB(err);
  });
}

// Update a wave
let updateWave = function(waveObj, successCB, errorCB) {
  let query = 
    `MATCH(w:${graphConsts.NODE_WAVE}{WaveID: '${waveObj.WaveID}'})-
      [r:${graphConsts.REL_HAS}]->(c:${graphConsts.NODE_COURSE})
    DELETE r
    SET 
      w.Location = '${waveObj.Location}',
      w.StartDate = '${waveObj.StartDate}',
      w.EndDate = '${waveObj.EndDate}'
    WITH w AS w
    MATCH (d:${graphConsts.NODE_COURSE}{ID:'${waveObj.Course}'})
    WITH w AS w, d AS d
    MERGE (w)-[:${graphConsts.REL_HAS}]->(d)
    RETURN w`;
  let session = driver.session();
  session.run(query).then(function(resultObj) {
    session.close();
    if (resultObj) {
      logger.debug(resultObj);
    } else {
      errorCB('Error');
    }
  });
};

// Delete a wave
let deleteWave = function(waveObj, successCB, errorCB) {
  console.log(waveObj, "waveObj")
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

// Fetch wave with waveid
let getWave = function(waveID, successCB, errorCB) {
  logger.debug('In get Wave', waveID);
  let query = 
    `MATCH(n:${graphConsts.NODE_WAVE}{WaveID: '${waveID}'}) RETURN n`;
  let session = driver.session();
  session.run(query).then(function(resultObj) {
    session.close();
    if (resultObj) {
      successCB(resultObj.records[0]._fields[0].properties);
    } else {
      errorCB('Error');
    }
  });
};

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

// Get WaveID's of all the waves
let getWaveIDs = function(successCB, errorCB) {
  let query = `MATCH(n:${graphConsts.NODE_WAVE}) RETURN DISTINCT n.WaveID`;
  let session = driver.session();
  session.run(query).then(function(resultObj) {
    session.close();
    if (resultObj) {
      let waves = []
      resultObj.records.map(function(res) {
        waves.push(res._fields[0])
      })
      successCB(waves);
      logger.debug(waves);
    } else {
      errorCB('Error');
    }
  });
};

// Get cadets of wave
let getCadetsOfWave = function(waveID, successCB, errorCB) {
  let query = `MATCH(n:${graphConsts.NODE_CANDIDATE})-[${graphConsts.REL_BELONGS_TO}]->(c:${graphConsts.NODE_WAVE}{WaveID:'${waveID}'}) RETURN n`;
  let session = driver.session();
  session.run(query).then(function(resultObj) {
    session.close();
    if (resultObj) {
      let candidateName = []
      resultObj.records.map(function(res) {
        logger.debug(res._fields[0])
        candidateName.push(res._fields[0].properties)
      })
      successCB(candidateName);
      logger.debug(candidateName,"candidateName");
    } else {
      errorCB('Error');
    }
  });
};

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

// Get all waves
let getWaves = function(successCB, errorCB) {
  let query = 
  `MATCH(w:${graphConsts.NODE_WAVE})-[:${graphConsts.REL_HAS}]->(c:${graphConsts.NODE_COURSE}) 
  RETURN w,c`;
  let session = driver.session();
  session.run(query).then(function(resultObj) {
    session.close();
    if (resultObj) {
      let waves = []
      resultObj.records.map(function(res) {
        let waveObj = res._fields[0].properties;
        waveObj.Course = res._fields[1].properties.ID;
        waves.push(waveObj);
      })
      successCB(waves);
    } else {
      errorCB('Error');
    }
  });
};

// let getCoursesForWave = function(waveID, successCB, `errorCB) {
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

// Update cadets for the wave
let updateWaveCadets = function (cadets, waveID, successCB, errorCB) {

  let session = driver.session();

  let query= `UNWIND ${JSON.stringify(cadets)} AS empID
        MATCH (candidate:${graphConsts.NODE_CANDIDATE} {EmployeeID: empID}),
          (wave: ${graphConsts.NODE_WAVE} {WaveID: '${waveID}'})
        MERGE (candidate)-[:${graphConsts.REL_BELONGS_TO}]->(wave)
        RETURN candidate`;
  
  let count  = 0;
  session.run(query).then(function(result) {
    session.close();
    result.records.map(function(record) {
      let userObj = {};
      let cadetObj = record._fields[0].properties;
      userObj.name = cadetObj.EmployeeName;
      userObj.email = cadetObj.EmailID;
      userObj.username = cadetObj.EmailID.split('@')[0];
      userObj.password = config.DEFAULT_PASS;
      userObj.role = 'candidate';
      logger.debug('User obj created', userObj);
      adminMongoController.addUser(userObj, function (savedUser) {
        logger.info('New User Created: ', savedUser);
        count = count+1;
        if(count == cadets.length) {
          successCB(result);
        }
      }, function (err2) {
        logger.error('Error in creating user', err2);
        errorCB(err2);
      });
    })
    
  }).catch(function(err) {
    errorCB(err);
  });
}

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

/**********************************************
************ Assessment Tracker *************
**********************************************/

let getAssessmentTrack =  function(waveID, successCB, errorCB) {
  let query = `MATCH (a:${graphConsts.NODE_ASSIGNMENT})<-[:${graphConsts.REL_HAS}]-(c:${graphConsts.NODE_COURSE})<-[:${graphConsts.REL_HAS}]-(w:${graphConsts.NODE_WAVE}{WaveID:'${waveID}'}) return COLLECT(a)`;
    let session = driver.session();
       session.run(query).then(function (resultObj, err) {
           session.close();
  if(err) {
			errorCB(err);
		}
    let assessment = [];
    resultObj.records[0]._fields[0].map(function (record) {
      assessment.push(record.properties)
    })
    successCB(assessment);
	});
};

let mapAssessmentTrack = function (assessments, update, successCB, errorCB) {
  if(update) {
    assessments.map(function (assessment) {
    let query = `
      MATCH (a:${graphConsts.NODE_ASSIGNMENT}{Name:'${assessment.assignment}'})<-[r:${graphConsts.REL_WORKEDON}]-(c:${graphConsts.NODE_CANDIDATE}{EmployeeID:'${assessment.EmpID}'})
      set r.implement='${assessment.remarks.implement}',
      r.complete='${assessment.remarks.complete}',
      r.learn = '${assessment.remarks.learn}'`
      let session = driver.session();
         session.run(query).then(function (resultObj, err) {
             session.close();
           })
  }, successCB())
  } else {
    assessments.map(function (assessment) {
    let query = `
      MATCH (a:${graphConsts.NODE_ASSIGNMENT}{Name:'${assessment.assignment}'}),(c:${graphConsts.NODE_CANDIDATE}{EmployeeID:'${assessment.EmpID}'})
      MERGE (a)<-[:${graphConsts.REL_WORKEDON}{implement:'${assessment.remarks.implement}',complete:'${assessment.remarks.complete}',learn:'${assessment.remarks.learn}'}]-(c)`
      let session = driver.session();
         session.run(query).then(function (resultObj, err) {
             session.close();
           })
  }, successCB())
  }
}

let assessmentsandcandidates = function(waveID, assessment, successCB, errorCB) {
  let query = `
    MATCH (n:${graphConsts.NODE_CANDIDATE})-[:${graphConsts.REL_BELONGS_TO}]->(c:${graphConsts.NODE_WAVE}{WaveID:'${waveID}'})
    with collect(n) as n
    unwind n as cadet
    OPTIONAL MATCH (cadet)-[r:${graphConsts.REL_WORKEDON}]-(a:${graphConsts.NODE_ASSIGNMENT}{Name:'${assessment}'})
    RETURN {cadet:cadet, assignment:r}`
    let session = driver.session();
    let candidates = [];
       session.run(query).then(function (resultObj, err) {
           session.close();
           resultObj.records.map(function (res) {
             let assignment = null;
             if(res._fields[0].assignment != null) {
               assignment= res._fields[0].assignment.properties
             }
             let detail = {
               cadet: res._fields[0].cadet.properties,
               assignment: assignment
              }
              candidates.push(detail);
           })
           successCB(candidates)
         });
}

  module.exports = {
    addCadet,
    updateCadet,
    updateCadets,
    getCadets,
    getCadet,
    getNewCadets,
    addCourse,
    getCourses,
    updateCourse,
    getWaves,
    addWave,
    updateWave,
    getWave,
    deleteWave,
    getCadetsOfWave,
    updateWaveCadets,
    getWaveIDs,
    addProduct,
    deleteAssignmentOrSchedule,
    deleteOrRestoreCourse,
    addVersion,
    deleteProduct,
    deleteVersion,
    updateVersion,
    getProducts,
    getAssessmentTrack,
    mapAssessmentTrack,
    assessmentsandcandidates
  }
  // getWaveIDs,
  // getWaveSpecificCandidates,
  // getWaveObject,
  // getWaves,
  // updateWave,
  // getCoursesForWave,
  // addWave,
  // deleteWave,
  // getActiveWaves
