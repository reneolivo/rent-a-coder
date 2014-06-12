var express		= require( 'express' );
var router		= express.Router();

var authorize	= require( '../services/authorize-net/authorize-net' );
var secrets		= require( '../data/secrets' );


router.get('/register', function(req, res) {
	res.render( 'account/register' );
});



router.post('/register', function(req, res) {
	var requiredFields = [
		'firstName'	: 'First Name',
		'lastName'	: 'Last Name',
		'email'		: 'Email',
		'password1'	: 'Password',
		'password2'	: 'Repeat Password'
	];

	for(var i in requiredFields) {
		if (typeof req.body[ i ] === 'undefined' || _.isEmpty( req.body[ i ]))) {
			return renderError( 'Field <b>' + requiredFields[ i ] + '</b> can\'t be empty.');
		}
	}

	// Shallow email validation:
	// http://stackoverflow.com/questions/4727145/regex-for-email-validation-not-working-with-subdomains
	if (/^\w+(?:\.\w+)*@\w+(?:\.\w+)+$/.test( req.body.email ) == false) {
		return renderError( "Please provide a valid email address" );
	}

	if (req.body.password1 !== req.body.passwrd2) {
		return renderError( "Passwords don't match." );
	}

	if (req.body.password1.length < 8 || req.body.password1.length > 32) {
		return renderError( "The Password length must be between 8 and 32 characters" );
	}

	db.findOne({ email : req.body.email }, function(err, doc) {
		if (err) {
			return renderError( 'Internal error.' );
		} else if (doc !== null) {
			renderError( 'The email <b>' + req.body.email + '</b> has already been registered' );
		} else {
			registerUser();
		}
	});

	function registerUser() {
		Account.create( req.body, function(err, result) {
			if (err) {
				return renderError(
					"We couldn't create your account due to some internal errors. Please try again."
				);
			}

			req.session.registeredUser = result;

			res.redirect( '/registerd-successfully' );
		});
	}

	function renderError(msg) {
		return res.render( 'account/register', {
			error: msg
		});
	}
});

module.exports = router;