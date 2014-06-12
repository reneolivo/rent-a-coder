var db			= require( '../../models/db' )( 'accounts' );
var CH 			= require( '../helpers/CryptoHelper' );
var _			= require( 'lodash' );
var secrets		= require( '../../data/secrets' );
var authorize	= require( '../authorize-net/authorize-net' );

function Account() {

}

Account.prototype.getByEmail	= function getByEmail(email, callback) {
	db.findOne( { email : email }, callback );
}

Account.prototype.create = function create(userData, callback) {
	var self	= this;

	var salt	= CH.generateSalt( secrets.authorize.loginId );
	var pass	= CH.hash( userData.password1, salt );

	var user	= {
		authorizeId	: null,
		firstName	: userData.firstName,
		lastName	: userData.lastName,
		email		: userData.email,
		salt		: salt,
		password	: pass
	};

	db.insert( user, function(err, doc) {
		if (err) {
			if (_.isFunction(callback)) {
				callback( err, null );
			}

			return;
		}

		self._registerUserOnAuthorize(doc, function(authError, result) {
			if (authError) {
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

Account.prototype._registerUserOnAuthorize = function _registerUserOnAuthorize(doc, callback) {
	var data = {
		merchantCustomerId	: doc._id,
		email				: doc.email,
		description			: encodeURIComponent( doc.firstName + ' ' + doc.lastName )
	};

	authorize.createCustomerProfile(data, callback);
}

Account.prototype.update = function update(docId, properties, callback) {
	db.update( { _id : docId }, { $set : properties }, callback );
}

Account.prototype.remove = function remove(docId, callback) {
	db.remove( { _id : docId }, callback );
}

module.exports = new Account();