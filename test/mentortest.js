var app = require('../server/app')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var should = require('should');
var supertest=require('supertest');
var sinon = require('sinon');
request = request(app);
var url=supertest("http://localhost:8080");
var token= '';
const CourseModel = require('./../models/courses.js');

describe("Make GET requests to domain ", function() {
    this.timeout(15000);
    it('Simple GET Request to root url', function(done) {
        request.get('/').expect(200, done);
    });
    it('Testing for not defined route', function(done) {
        request.get('/_undefined_route').expect(404, done);
        this.timeout(10000)
    });
      });

    //login route
      describe("Testing MENTOR-POST route", function(err){
        it("should check mentor login", function(done){
          url
            .post('/login')
            .send({"username": "simanta", "password":"simanta"})
            .expect(200)
            .end(function(err,res){
              should.not.exist(err);
              token = res.body.token;
              done();
            });
            });
          });
    /****************************************************
    *******testing-get (mentor dashboardroutes) ********
    ****************************************************/
    describe("Testing GET dashboard-routes",function(){
      this.timeout(15000);
      it("get the logged user",function(done){
         url
            .get('/dashboard/user')
            .set({"Authorization":token})
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res){
              console.log(res.body);
            if (err) throw err;
            done();
         });
          });
  it("get projects",function(done){
    this.timeout(50000);
     setTimeout(done, 50000);
     url
       .get('/dashboard/projects')
       .set({"Authorization":token})
       .expect(201)
       .end(function(err, res){
         console.log(res.body);
       if (err) throw err;
       done();

     });
});
  it("get cadets",function(done){
     url
       .get('/dashboard/cadets')
       .set({"Authorization":token})
       .expect('Content-Type', /json/)
       .expect(201)
       .end(function(err, res){
         console.log(res.body);
       if (err) throw err;
       done();

     });
});
it("get wavespecificationCandidates",function(done){
   url
     .get('/dashboard/wavespecificcandidates?waveID='+'I-12')
     .set({"Authorization":token})
     .expect('Content-Type', /json/)
     .expect(201)
     .end(function(err, res){
       console.log(res.body);
     if (err) throw err;
     done();

   });
});
it("get courses for wave",function(done){
   url
     .get('/dashboard/coursesforwave?waveID=' + 'I-14')
     .set({"Authorization":token})
     .expect('Content-Type', /json/)
     .expect(201)
     .end(function(err, res){
       console.log(res.body);
     if (err) throw err;
     done();

   });
});
it("GET Candidates And Tracks",function(done){
   url
     .get(`/dashboard/candidatesandtracks/${'I-14'}/${'MEAN'}`)
     .set({"Authorization":token})
     .expect('Content-Type', /json/)
     .expect(201)
     .end(function(err, res){
       console.log(res.body);
     if (err) throw err;
     done();

   });
});
it("GET unique waveids",function(done){
   url
     .get(`/dashboard/waveids`)
     .set({"Authorization":token})
     .expect('Content-Type', /json/)
     .expect(201)
     .end(function(err, res){
       console.log(res.body);
     if (err) throw err;
     done();

   });
});
it("GET waveobj for particular waveids",function(done){
   url
     .get(`/dashboard/waveobject/${'I-13'}`)
     .set({"Authorization":token})
     .expect('Content-Type', /json/)
     .expect(201)
     .end(function(err, res){
       console.log(res.body);
     if (err) throw err;
     done();

   });
});
  });

  /**************************************************
  *******   testing-get (mentor mentor-routes) ********
  ***************************************************/
  describe("Testing GET mentor-routes",function(){
    this.timeout(15000);
    it("get all the trainingTrack",function(done){
       url
          .get('/mentor/trainingtracks')
          .set({"Authorization":token})
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err, res){
            console.log(res.body);
          if (err) throw err;
          done();
       });
        });
            it("get all courses",function(done){
               url
                  .get('/mentor/courses')
                  .set({"Authorization":token})
                  .expect('Content-Type', /json/)
                  .expect(201)
                  .end(function(err, res){
                    console.log(res.body);
                  if (err) throw err;
                  done();
               });
                });
        });

  /**************************************************
  *******   testing-post (mentor mentor-routes) ********
  ***************************************************/
 describe("Testing POST route for course", function(err){
        this.timeout(25000);
        it("mentor course addition", function(done){
          url
            .post('/mentor/addcourse')
            .set({"Authorization":token})
            .send({"CourseID":100,"CourseName":'ng2Spring',"AssessmentCategories":['angular 2'],"Duration":'12 weeks',"History":''})
            .expect(201)
            .end(function(err,res){
              should.not.exist(err);
              done();
            });
            });

        it("should update course", function(done){
          url
            .post('/mentor/updatecourse')
            .set({"Authorization":token})
            .send({"CourseID":100,"CourseName":'ng2Spring',"AssessmentCategories":['angular 2','javascript'],"Duration":'12 weeks',"History":'Simanta'})
            .expect(201)
            .end(function(err,res){
              should.not.exist(err);
              done();
            });
            });
        it("should delete a course", function(done){
          url
            .post('/mentor/deletecourse')
            .set({"Authorization":token})
            .send({"CourseID":100})
            .expect(200)
            .end(function(err,res){
              should.not.exist(err);
              done();
          });
      });
      it("should restore a course", function(done){
          url
            .post('/mentor/restorecourse')
            .set({"Authorization":token})
            .send(['ng2Spring'])
            .expect(200)
            .end(function(err,res){
              should.not.exist(err);
              done();
          });
      });
        it("should add a new category", function(done){
          let category = {'Name':'Java','Mentor':'Simanta','Duration':'1 week','Videos':'www.google.com','Blogs':'www.google.com','Docs':'www.google.com'}
          url
            .post('/mentor/addcategory')
            .set({"Authorization":token})
            .send({'CourseID':100,'History':'Simanta','Categories':category})
            .expect(200)
            .end(function(err,res){
              should.not.exist(err);
              done();
          });
      });
        it("should delete a category", function(done){
          let category = {'Name':'Java','Mentor':'Simanta','Duration':'1 week','Videos':'www.google.com','Blogs':'www.google.com','Docs':'www.google.com'}
          url
            .post('/mentor/deletecategory')
            .set({"Authorization":token})
            .send({'CourseID':100,'History':'Simanta','Categories':category})
            .expect(200)
            .end(function(err,res){
              should.not.exist(err);
              done();
          });
      });
      after(()=>{
        CourseModel.remove({'CourseID':100},function (err, result) {
        if(err)
          errorCB(err);
        successCB(result)
      })
    })
  }); 

 describe("Testing POST route for program flow", function(err){
  it("add a new session", function(done){
    let session = {
        SessionID: 1,
        CourseName: 'MERN',
        Week: '1',
        Activities: 'eating',
        Status: 'completed',
        ContextSetSession: 'jo',
        SessionBy: 'joe',
        SessionOn: 'java',
        Remarks: 'good'
      }
          url
            .post('/mentor/addnewsession')
            .set({"Authorization":token}) 
            .send({session: session, waveID: 'I-14'})
            .expect(201)
            .end(function(err,res){
              should.not.exist(err);
              done();
            });
            });
  it("update session", function(done){
    let session = {
        SessionID: 1495109231079,
        CourseName: 'MERN',
        Week: '1',
        Activities: 'eating',
        Status: 'completed',
        ContextSetSession: 'jo',
        SessionBy: 'joe',
        SessionOn: 'java',
        Remarks: 'bad'
      }
          url
            .post('/mentor/updatesession')
            .set({"Authorization":token})
            .send({session: session, waveID: 'I-14'})
            .expect(201)
            .end(function(err,res){
              should.not.exist(err);
              done();
            });
            });
});

describe("Testing POST route for saving evaluation", function(err){
    it("should save a evaluation", function(done){
          let evaluationObj = {}
              evaluationObj.cadetID = '351611';
              evaluationObj.cadetName = 'Yuvashree S';
              evaluationObj.attitude = 4;
              evaluationObj.punctuality = 4;
              evaluationObj.programming = {
                                            1: 5,
                                            2: 4,
                                            3: 4,
                                            4: 4,
                                            5: 5
                                          };
              evaluationObj.codequality = {
                                            1: 4,
                                            2: 4,
                                            3: 5,
                                            4: 4
                                          };
              evaluationObj.testability = {
                                            1: 5,
                                            2: 4,
                                            3: 5,
                                            4: 4,
                                            5: 5,
                                            6: 4
                                          };
              evaluationObj.engineeringculture = {
                                            1: 5,
                                            2: 4,
                                            3: 4,
                                            4: 4,
                                            5: 5
                                          };
              evaluationObj.technology = {
                                          1: 5,
                                          2: 5,
                                          3: 5,
                                          4: 5,
                                          5: 5,
                                          6: 5,
                                          7: 5,
                                          8: 5,
                                          9: 5,
                                          10: 5,
                                          11: 5,
                                          12: 5,
                                          13: 5,
                                          14: 5,
                                          15: 5,
                                          16: 5,
                                          17: 5
                                          };
              evaluationObj.communication = {
                                            1: 4,
                                            2: 4,
                                            3: 4
                                          };
              evaluationObj.overall = 5;
              evaluationObj.doneWell = 'good';
              evaluationObj.improvement = 'nothing';
              evaluationObj.suggestions = 'nothing';
    url
            .post('/dashboard/saveevaluation')
            .set({"Authorization":token})
            .send(evaluationObj)
            .expect(200)
            .end(function(err,res){
              console.log(err)
              should.not.exist(err);
              done();
          });
      });
 })
