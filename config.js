var path = require( 'path' );

var config = {
	DBPATH	: path.join( __dirname, 'data', 'db', 'rent-a-coder.db')
};

module.exports = config;