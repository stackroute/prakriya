const router = require('express').Router();
const userModel = require('../../models/users.js');
const passport = require('passport');

router.post('/', 
  passport.authenticate(
  	'local', 
  	{
  		failureFlash : 'Invalid login attempt..!', 
  		successFlash: 'Welcome to Prakriya'
  	}
  ),
  function(req, res) {
    res.send(true);
  }
)

module.exports = router;