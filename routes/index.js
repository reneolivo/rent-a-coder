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
	var id = req.params.id;

	db.findOne({_id: id}, function(err, doc) {
		if (err) {
			return res.send(500, err);
		} else if (doc === null) {
			return res.send(404, 'Coder Not Found');
		}

		res.render( 'coder-details', { coder: doc } );
	});
}

router.get('/coder/:id', coder_details);
router.post('/coder/:id', coder_details);

module.exports = router;
