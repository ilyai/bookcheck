var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var routes = require('./routes/index');
// var users = require('./routes/users');
var request = require('request');
var cheerio = require('cheerio');
var db = require('pg-bricks').configure('/var/run/postgresql bookcheck');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

app.get('/', function(req, res, next) {
  db.select().from('bookmarks').rows(function(err, bm) {
    if (err) return next(err);
    res.render('index', { bookmarks: bm });
  });
});

app.post('/', function(req, res, next) {
  request(req.body.url, function(err, resp, body) {
    if (err) return next(err);
    var $ = cheerio.load(body);
    var title = $('title').text().trim() || req.body.url;
    db.insert('bookmarks', {
      url: req.body.url,
      title: title
    }).run(function() {
      res.redirect('/');
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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
