var _			= require( 'lodash' );
var Authorize 	= require( 'auth-net-types' );
var auth		= require( '../authorize-net/authorize-net' );

function Transactions() {
	
}

Transactions.prototype.create = function create(userId, cardId, amount, callback) {
	var transactionData = {
		amount						: ( amount + 0 ).toFixed( 2 ),
		customerProfileId			: userId,
		customerPaymentProfileId	: cardId
	};

	auth.createCustomerProfileTransaction(
		'AuthCapture', /* AuthOnly, CaptureOnly, PriorAuthCapture */
		transactionData,
		callback
	);
};

module.exports = new Transactions();