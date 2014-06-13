var express = require( 'express' );
var router	= express.Router();
var _		= require( 'lodash' );
var Card	= require( '../services/account/credit-cards' );

router.post('/add', function(req, res) {
	if (_.isUndefined( req.user ) || _.isEmpty( req.user )) {
		res.redirect( '/account/login' );
	}

	var cardData = {
		cardNumber		: req.body.number,
		expirationDate	: req.body.expYear + '-' + req.body.expMonth,
		cardCode		: req.body.code
	};

	Card.create(
		req.user,
		cardData,
		function(err, result) {
			if (err) {
				if (err.ErrorResponse) {
					console.error( err.ErrorResponse.messages );
				} else {
					console.error( err );
				}

				res.send(
					500, 
					'There was an error processing the credit card. Please try again'
				);

				return;
			}

			res.redirect( '/account?card-creted' );
		}
	);
});

module.exports = router;