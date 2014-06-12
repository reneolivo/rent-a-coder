var express         = require('express');
var path            = require('path');
//var favicon         = require('static-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var cookieSession   = require('cookie-session')
var bodyParser      = require('body-parser');
var less            = require('less-middleware');

var routes          = require('./routes/index');
var accountRoutes   = require('./routes/account');

var app             = express();

var Account         = require('./services/account/account');
var secrets         = require('./data/secrets');

var bootstrapPath   = path.join(__dirname, 'public', 'bower_components', 'bootstrap');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cookieSession( { secret: secrets.sessionSecret } ));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.pretty = true

app.locals.config = require('./config');

app.use(less(path.join(__dirname, 'public/stylesheets', 'less'), {
    parser: {
        paths   : [ path.join(bootstrapPath, 'less') ],
    },
    dest    : path.join(__dirname, 'public', 'stylesheets'),
    prefix  : '/stylesheets',
    debug   : true
}));

app.use('*', function(req, res, next) {
    if (typeof req.session.user === 'undefined' || req.session.user === null) {
        return next();
    }

    Account.findById(req.session.user, function(err, doc) {
        if (err) {
            return console.error( err );
        }

        req.user = doc;

        next();
    });
});

app.use('/', routes);
app.use('/account', accountRoutes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
