var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});

/* GET home page. */
router.get('/coder/:id', function(req, res) {
	res.render('coder-details');
});

module.exports = router;
