var DataStore	= require( 'nedb' );
var config		= require( '../config' );

var db			= new DataStore( { filename: config.DBPATH, autoload: true } );

module.exports	= db;