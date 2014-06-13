var express = require( 'express' );
var route	= express.Router();
var _		= require( 'lodash' );

router.post('create', function(req, res) {
	if (_.isUndefined( req.user ) || _.isEmpty( req.user )) {
		res.redirect( '/account/login' );
	}

	var date		= new Date( req.body.expirationDate );
	var dateString	= date.getFullYear();
	var month		= date.getMonth() + 1;

	if (month <= 9) {
		month = '0' + month;
	}

	dateString		= dateString + '-' + month;

	var cardData = {
		cardNumber		: req.body.number,
		expirationDate	: dateString,
		cardCode		: req.body.code
	};

	Card.create(
		req.user.authorizeId,
		cardData,
		function(err, result) {
			if (err) {
				console.error( err );

				return res.send(
					500, 
					'There was an error processing the credit card. Please try again'
				);
			}

			res.redirect( '/account?card-creted' );
		}
	);
});