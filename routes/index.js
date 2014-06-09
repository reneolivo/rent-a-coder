var db		= require( '../models/db' );
var express	= require( 'express' );
var router	= express.Router();
var curl	= require( 'curlrequest' );

var secrets	= require( '../data/secrets' );

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

		res.render('coder-details', {
			coder	: doc,
			secrets : secrets 
		});
	});
}

router.get('/coder/:id', coder_details);
router.post('/coder/:id', coder_details);


/* GET thank you. */
function thank_you(req, res) {
	res.render('thank-you', { post: req.body } );
}

router.get('/thank-you', thank_you);
router.post('/thank-you', thank_you);


/* POST IPN */
router.post('/payment-confirmation', function(req, res) {
	//ENVIAR UN EMPTY STRING:
	res.send(200, '');

	//VERIFY
	var data	= req.body;
	data.cmd	= '_notify-validate';

	curl.request(
		{
			url		: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
			method	: 'post',
			data	: data
		},
		function response(err, response, headers) {
			db.insert({
				err: err,
				response: response,
				headers: headers
			});
		}
	);
});


module.exports = router;
