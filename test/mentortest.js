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
    // it("get all the trainingTrack",function(done){
    //    url
    //       .get('/mentor/trainingtracks')
    //       .set({"Authorization":token})
    //       .expect('Content-Type', /json/)
    //       .expect(201)
    //       .end(function(err, res){
    //         console.log(res.body);
    //       if (err) throw err;
    //       done();
    //    });
    //     });
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
