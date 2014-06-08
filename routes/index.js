var db		= require( '../models/db' );
var express	= require( 'express' );
var router	= express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	db.find({}, function(err, docs) {
		if (err) {
			return res.send(500, err);
		}

		res.render( 'index', { coders: docs } );
	});
});

/* GET coder details. */
function coder_details(req, res) {
	res.render('coder-details');
}

router.get('/coder/:id', coder_details);
router.post('/coder/:id', coder_details);

module.exports = router;
