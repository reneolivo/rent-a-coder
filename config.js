var path = require( 'path' );

var config = {
	baseURL	: 'http://localhost:3000',
	DBPATH	: path.join( __dirname, 'data', 'db' )
};

module.exports = config;