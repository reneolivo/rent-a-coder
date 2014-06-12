var db	= require( '../models/db' )( 'accounts' );
var CH 	= require( '../helpers/CryptoHelper' );
var _	= require( 'lodash' );

function Account() {

}

Account.prototype.create = function create(userData, callback) {
	var self	= this;

	var salt	= CH.generateSalt( secrets.authorize.loginId );
	var pass	= CH.hash( req.body.password1, salt );

	var user = {
		authorizeId	: null,
		firstName	: req.body.firstName,
		lastName	: req.body.lastName,
		email		: req.body.email,
		salt		: salt,
		password	: password
	};

	db.insert( user, function(err, doc) {
		if (err) {
			if (_.isFunction(callback)) {
				callback( err, null );
			}

			return;
		}

		self._registerUserOnAuthorize(doc, function(authError, result) {
			if (err) {
				return self.remove( doc._id, function(err) {
					if (_.isFunction( callback )) {
						callback( authError, null );
					}
				});
			}

			self.update(
				doc._id, { 
					authorizeId : result.customerProfileId
				}, 
				callback
			);
		});
	});
}

Account.prototype._registerUserOnAuthorize = _registerUserOnAuthorize(doc, callback) {
	auth.createCustomerProfile({
			merchantCustomerId	: doc._id,
			email				: doc.email,
			description			: doc.firstName + ' ' + doc.lastName
	}, callback);
}

Account.prototype.update = function update(docId, properties, callback) {
	db.update( { _id : docId }, properties, callback );
}

Account.prototype.remove = function remove(docId, callback) {
	db.remove( { _id : docId }, callback );
}

module.exports = new Account();