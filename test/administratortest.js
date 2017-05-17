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
  describe("Testing POST route", function(err){
    this.timeout(50000);

    it("should check administrator login", function(done){
      url
        .post('/login')
        .send({"username": "joe", "password":"joe123"})
        .expect(200)
        .end(function(err,res){
          should.not.exist(err);
          token = res.body.token;
          done();
        });
        });
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
/****************************************************
  ******testing-get (administrator dashboardroutes) ********
  ****************************************************/
            it("get files",function(done){
               url
                  .get('/dashboard/files')
                  .set({"Authorization":token})
                  .expect('Content-Type', /json/)
                  .expect(201)
                  .end(function(err, res){
                    console.log(res.body);
                  if (err) throw err;
                  done();
               });
                });
                it("get all users",function(done){
                   url
                      .get('/dashboard/users')
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
