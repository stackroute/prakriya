const router = require('express').Router();
const users = require('../../models/users.js');

router.post('/', function(req, res) {
	users.findOne(req.body, function(err, foundDomain) {
    if (err) {
      res.send(err);
    }

    if (!foundDomain) {
    	res.send({
        error: "Null domain object while retriving the domain from mongo..!"
      })
    }
    else 
    	res.send(true);
  });
})

module.exports = router;