var db		= require( '../models/db' )( 'rent-a-coder' );
var express	= require( 'express' );
var router	= express.Router();
var curl	= require( 'curlrequest' );

var secrets	= require( '../data/secrets' );

var Trans	= require( '../services/account/transactions' );

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

/* GET cart. */


router.get('/cart', function cart(req, res) {
	var id = req.params.id;

	db.find({}).limit(3).exec(function(err, doc) {
		if (err) {
			return res.send(500, err);
		}

		res.render('cart', {
			coders	: doc,
			secrets : secrets,
			user	: req.user
		});
	});
});

router.post('/cart', function cart(req, res) {
	if (typeof req.user === 'undefined' || req.user === null) {
		res.redirect( '/account/login' );
	}

	db.find({ _id : { $in : req.body.item_id } }, function(err, result) {
		if (err) {
			res.send(500);
		}

		//We'll just assume the cart was not empty, etc.
		var amountToCharge = 0;

		for(var i in result) {
			var index		= req.body.item_id.indexOf( result[ i ]._id );
			var quantity	= req.body.quantity[ index ];
			var amount		= result[ i ].price * quantity;

			amountToCharge	+= amount;
		}

		Trans.create(
			req.user.authorizeId,
			req.body.card,
			amountToCharge,
			function(err, result) {
				if (err) {
					if (err.ErrorResponse) {
						console.error( err.ErrorResponse.messages );
					} else {
						console.error( err );
					}

					res.send(
						500, 
						'Something wrong went with the transaction. Please try again'
					);

					return;
				}

				res.redirect( '/thank-you' );
			}
		);
	});
});


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
			method	: 'POST',
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
