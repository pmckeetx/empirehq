var express = require( 'express' );
var path = require( 'path' );
// var favicon = require( 'serve-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );

var debug = require( 'debug' )( 'strata:server' );
var http = require( 'http' );

var routes = require( './server/routes/index' );

var rest = require( './server/lib/rest.js' );

var app = express();

// view engine setup
app.set( 'views', path.join( __dirname, 'server/views' ) );
app.set( 'view engine', 'ejs' );

// uncomment after placing your favicon in /public
// app.use( favicon( __dirname + '/public/favicon.ico' ) );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended: false} ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'client' ) ) );

/**
 * Config rest server.
 */
rest.init( app, { name: 'empire', db: { database: 'empire' } } );
app.use( '/', routes );

// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
    console.log( req.path );
    if( /.\.(css|js|html)$/.test( req.path ) ) {
        var err = new Error( 'Not Found' );
        err.status = 404;
        next( err );
    } else {
        console.log( 'return index.ejs' );
        res.render( 'index', { title: 'Strata' } );
    }
} );

// error handlers

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
	app.use( function ( err, req, res, next ) {
		res.status( err.status || 500 );
		res.render( 'error', {
			message: err.message,
			error: err
		} );
	} );
}

// production error handler
// no stacktraces leaked to user
app.use( function ( err, req, res, next ) {
	res.status( err.status || 500 );
	res.render( 'error', {
		message: err.message,
		error: {}
	} );
} );

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort( process.env.PORT || '8080' );
app.set( 'port', port );

/**
 * Create HTTP server.
 */

var server = http.createServer( app );

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen( port );
server.on( 'error', onError );
server.on( 'listening', onListening );

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort( val ) {
    var port = parseInt( val, 10 );

    if ( isNaN( port ) ) {
        // named pipe
        return val;
    }

    if ( port >= 0 ) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError( error ) {
    if ( error.syscall !== 'listen' ) {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch ( error.code ) {
    case 'EACCES':
        console.error( bind + ' requires elevated privileges' );
        process.exit( 1 );
        break;
    case 'EADDRINUSE':
        console.error( bind + ' is already in use' );
        process.exit( 1 );
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug( 'Listening on ' + bind );
}

module.exports = app;