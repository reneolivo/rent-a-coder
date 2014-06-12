var DataStore	= require( 'nedb' );
var config		= require( '../config' );
var path		= require( 'path' );

function prepareDB(dbName) {
	var dbPath		= path.join( config.DBPATH, dbName + '.db' );

	return new DataStore( { filename: dbPath, autoload: true } );
}

module.exports	= prepareDB;