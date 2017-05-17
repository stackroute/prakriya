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
    it("should check admin login", function(done){
      url
        .post('/login')
        .send({"username": "admin", "password":"admin"})
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
******testing-get (admin dashboardroutes) ********
****************************************************/
            it("get the notification",function(done){
               url
                  .get(`/dashboard/notifications?username=${'simanta'}`)
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
  ******testing-get (admin adminroutes) ********
  ****************************************************/
  it("get all the users",function(done){
      this.timeout(15000);
     url
        .get('/admin/users')
        .set({"Authorization":token})
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res){
          console.log(res.body);
        if (err) throw err;
        done();
     });
      });
      it("get all the roles",function(done){
          this.timeout(15000);
         url
            .get('/admin/roles')
            .set({"Authorization":token})
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res){
              console.log(res.body);
            if (err) throw err;
            done();
         });
          });
          it("get all the accesscontrols",function(done){
              this.timeout(15000);
             url
                .get('/admin/accesscontrols')
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
