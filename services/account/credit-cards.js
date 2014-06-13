var _			= require( 'lodash' );
var Authorize	= require( 'auth-net-types' );
var auth		= require( '../authorize-net/authorize-net' );
var Account		= require( './account' );

function CreditCardsService() {

}

CreditCardsService.prototype.create = function create(user, creditCardData, callback) {
	var self		= this;

	var options		= {
		customerType	: 'individual',
		payment			: {
			creditCard	: creditCardData
		}
	};

	auth.createCustomerPaymentProfile(
		{
			customerProfileId	: user.authorizeId,
			paymentProfile		: options
		},
		function(err, creditCardResult) {
			if (err) {
				if (_.isFunction( callback )) {
					callback( err, null );
				}

				return;
			}

			Account.addCreditCard(
				user._id,
				creditCardResult.customerPaymentProfileId,
				creditCardData, 
				function(err, result) {
					if (err) {
						return self.remove(
							user.authorizeId,
							creditCardResult.customerPaymentProfileId,
							function() {
								if (_.isFunction( callback )) {
									callback( err, null );
								}
							}
						);
					}

					if (_.isFunction( callback )) {
						callback( null, creditCardResult );
					} 
				}
			);
		}
	);
}



module.exports = new CreditCardsService();