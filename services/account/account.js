var db			= require( '../../models/db' )( 'accounts' );
var CH 			= require( '../helpers/CryptoHelper' );
var _			= require( 'lodash' );
var secrets		= require( '../../data/secrets' );
var authorize	= require( '../authorize-net/authorize-net' );

function Account() {

}

Account.prototype.findByEmail	= function findByEmail(email, callback) {
	db.findOne( { email : email }, callback );
}

Account.prototype.findById = function findById(id, callback) {
	db.findOne( { _id : id }, callback );
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

Account.prototype.login = function(email, password, callback) {
	if (!_.isFunction( callback )) {
		return;
	}

	this.findByEmail(email, function(err, doc) {
		if (err) {
			return callback( err, null );
		}

		var hash = CH.hash( password, doc.salt );

		if (hash === doc.password) {
			callback( null, doc );
		} else {
			callback( null, null );
		}
	});
}

Account.prototype.update = function update(docId, properties, callback) {
	var self = this;

	db.update({ _id : docId }, { $set : properties }, function(err, numUpdated) {
		if (err) {
			if (_.isFunction( callback )) {
				callback( err, null );
			}

			return;
		}

		self.findById( docId, callback );
	});
}

Account.prototype.remove = function remove(docId, callback) {
	db.remove( { _id : docId }, callback );
}

module.exports = new Account();