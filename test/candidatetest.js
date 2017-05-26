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
//login route
  describe("Testing GET route", function(err){
    this.timeout(50000);
        it("should check candidate login", function(done){
      url
        .post('/login')
        .send({"username": "jothipriya.shekhar", "password":"digital@123"})
        .expect(200)
        .end(function(err,res){
          should.not.exist(err);
          token = res.body.token;
          done();
        });
        });
  /****************************************************
  ******testing-get (candidate dashboardroutes) ********
  ****************************************************/
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
            it("get all the cadets",function(done){
               url
                  .get('/dashboard/cadet')
                  .set({"Authorization":token})
                  .expect('Content-Type', /json/)
                  .expect(201)
                  .end(function(err, res){
                    console.log(res.body);
                  if (err) throw err;
                  done();
               });
                });
                it("get image",function(done){
                   url
                      .get(`/dashboard/getimage?eid=353743`)
                      .set({"Authorization":token})
                      .expect(200)
                      .end(function(err, res){
                        if (err) throw err;
                      done();
                   });
                    });
              });
  describe("Testing POST route", function(err){
    it("should check candidate save feedback", function(done){
      this.timeout(50000);
      let feedbackObj = {
                cadetID: '351611',
                cadetName: 'Yuvashree S',
                relevance: {
                  1: 5,
                  2: 3,
                  3: 5,
                  4: 4,
                  5: 5
                },
                training: {
                  1: 5,
                  2: 5,
                  3: 2,
                  4: 5
                },
                confidence: {
                  1: 5,
                  2: 5,
                  3: 3,
                  4: 5,
                  5: 4,
                  6: 5
                },
                mentors: {
                  1: 5,
                  2: 3,
                  3: 5,
                  4: 2,
                  5: 5
                },
                facilities: {
                  1: 5,
                  2: 3,
                  3: 5,
                  4: 2
                },
                overall: {
                  1: 5,
                  2: 4,
                  3: 5
                },
                mostLiked: 'assessments',
                leastLiked: 'stand ups'
              }
              url
                .post('/dashboard/savefeedback')
                .set({"Authorization":token})
                .send(feedbackObj)
                .expect(200)
                .end(function(err,res){
                  should.not.exist(err);
                  done();
              });
        });
  });
