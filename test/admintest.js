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
  describe("Testing ADMIN login", function(err){
    this.timeout(50000);
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
  });
  describe.skip("Testing ADMIN routes", function(err){
        it("get the logged user",function(done){
           url
              .get('/dashboard/user')
              .set({"Authorization":token})
              .expect('Content-Type', /json/)
              .expect(201)
              .end(function(err, res){
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
                  if (err) throw err;
                done();
             });
              });


      });
 /****************************************************
  ******testing-post (admin adminroutes) ********
  ****************************************************/
 describe.skip("Testing ADMIN-POST route for user", function(err){
    it("add users",function(done){
      let user = {}
      user.name = 'joe'
      user.username = 'test user'
      user.email = 'test@gmail.com'
      user.password = 'test123'
      user.role = 'mentor'
      url
          .post('/admin/adduser')
          .set({"Authorization":token})
          .send(user)
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            done();
       });
    });  
    it("update users",function(done){
      let user = {}
      user.name = 'joe'
      user.username = 'test user'
      user.email = 'test@gmail.com'
      user.password = 'test123'
      user.role = 'candidate'
      url
          .post('/admin/updateuser')
          .set({"Authorization":token})
          .send(user)
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            done();
       });
    }); 
    it("lock users",function(done){
      url
          .post('/admin/lockuser')
          .set({"Authorization":token})
          .send({username: 'test user'})
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            done();
       });
    });
    it("unlock users",function(done){
      url
          .post('/admin/unlockuser')
          .set({"Authorization":token})
          .send({username: 'test user'})
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            done();
       });
    }); 
    it("delete users",function(done){
      url
          .delete('/admin/deleteuser')
          .set({"Authorization":token})
          .send({username: 'test user'})
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            done();
       });
    });
  })
 describe("Testing ADMIN-POST route for user", function(err){
    it.skip("add roles",function(done){
      let roles = {};
      roles.name = 'test';
      roles.controls = ['TEST','CONTROL'];
      url
          .post('/admin/addrole')
          .set({"Authorization":token})
          .send(roles)
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            done();
       });
    });  
    it("update roles",function(done){
      let roles = {};
      roles.name = 'test';
      roles.controls = ['TEST','UPDATED'];
      url
          .post('/admin/updaterole')
          .set({"Authorization":token})
          .send(roles)
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            done();
       });
    }); 
    it("delete roles",function(done){
      let roles = {};
      roles.name = 'test';
      roles.controls = ['TEST','UPDATED'];
      url
          .delete('/admin/deleterole')
          .set({"Authorization":token})
          .send(roles)
          .expect(200)
          .end(function(err, res){
            if (err) throw err;
            done();
       });
    }); 
  })