let should = require('chai').should();
let sinon = require('sinon');
let sinonMongoose = require('sinon-mongoose');
let expect = require('chai').expect;
let User = require('./../models/users.js');

//sinon test for user.js
describe('User', () => {
    it('should add the user', (done) => {
        var userMock = sinon.mock(new User({name: 'Yuva', email: 'yuva@gmail.com', username: 'yuva', password: 'yuva', role: 'admin'}));
        var userObj = userMock.object;
        var expectedResult = {
            status: true
        };
        userMock.expects('save').yields(null, expectedResult);
        userObj.save(function(err, result) {
            userMock.verify();
            userMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });

     // Test will pass if the user is not updated based on an ID
   it("should update a user by id", function(done){
            var UserMock = sinon.mock(User({role:'candidate'}));
            var user = UserMock.object;
            var expectedResult = { status: true };
            UserMock.expects('update').yields(null, expectedResult);
            user.update({username:'yuva'},function (err, result) {
                UserMock.verify();
                UserMock.restore();
                console.log(result);
                expect(result.status).to.be.true;
                done();
            });
        });

});

    describe('User', () => {
        it("should delete a user by id", function(done){
            var UserMock = sinon.mock(User);
            var expectedResult = { status: true };
            UserMock.expects('remove').withArgs({username:'admin'}).yields(null, expectedResult);
            User.remove({username:'admin'}, function (err, result) {
                UserMock.verify();
                UserMock.restore();
                expect(result.status).to.be.true;
                done();
            });
        });
    });
