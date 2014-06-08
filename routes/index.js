var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});

/* GET coder details. */
function coder_details(req, res) {
	res.render('coder-details');
}

router.get('/coder/:id', coder_details);
router.post('/coder/:id', coder_details);

module.exports = router;
