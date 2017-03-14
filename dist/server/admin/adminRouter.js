const router = require('express').Router();
const passport = require('passport');
const adminMongoController = require('./adminMongoController');

router.post('/adduser',function(req, res) {
    let user = req.body
    user.username = user.email.split('@')[0]
    adminMongoController.addUser(user)
      .then(function(savedUser) {
        res.send(user)
      })
  }
)

module.exports = router;