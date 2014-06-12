var secrets		= require( '../../data/secrets' );
var Authorize	= require( 'auth-net-cim' );

var auth		= new Authorize({
	api			: secrets.authorize.loginId,
	key			: secrets.authorize.transactionKey,
	sandbox		: true
});

module.exports	= auth;