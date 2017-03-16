const router = require('express').Router();
const users = require('../../models/users.js');
// const passport = require('passport');
var auth = require('../auth')();
const adminMongoController = require('./adminMongoController');

router.get("/users", auth.authenticate(), function(req, res) {

    console.log("API HIT!!!");  
    try{
        adminMongoController.getUsers(function(users) {

                res.status(201).json(users);
            }, function(err) {
                res.status(500).json({ error: 'Cannot get all users from db...!' });
            });
    }
    catch(err){
       res.status(500).json({
                    error: 'Internal error occurred, please report...!'
                }); 
    }
});



module.exports = router;

