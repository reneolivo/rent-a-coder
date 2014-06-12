var crypto		= require( 'crypto' );

function CryptoHelper() {

}

//Psudo Unique ID:
//http://stackoverflow.com/questions/4872380/uniqid-in-javascript-jquery
CryptoHelper.prototype.uniqueId = function uniqueId() {
	return (
		new Date().getTime() + 
		Math.floor( Math.random() * 999999 )
	).toString( 16 );
}

CryptoHelper.prototype.generateSalt = function generateSalt(append) {
	var uniqueId = this.uniqueId();

	if (typeof append !== 'undefined') {
		uniqueId = append + uniqueId;
	}

	return this.hash( uniqueId );
}

CryptoHelper.prototype.hash = function hash(string, salt) {
	if (typeof salt !== 'undefined') {
		string = salt + string;
	}

	var shasum = crypto.createHash('sha1');

	shasum.update( string );

	return shasum.digest( 'hex' );
}

module.exports = new CryptoHelper();