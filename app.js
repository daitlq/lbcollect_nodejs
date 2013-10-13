
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

//Connect to database
var mongoose = require('mongoose');
mongoose.connect( 'mongodb://localhost:27017/db_lbcollect' );
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// book
api_book = require('./api/book');
app.get('/api/books', api_book.getAll);
app.get('/api/books/:id', api_book.getById);
app.post('/api/books', api_book.addBook);
app.put('/api/books/:id', api_book.updateBook);
app.delete('/api/books/:id', api_book.deleteBook);

// tag
api_tag = require('./api/tag');
app.get('/api/tags', api_tag.getAll);

// booktag
api_booktag = require('./api/booktag');
app.get('/api/booktags', api_booktag.getAll);
app.post('/api/booktags', api_booktag.addBookTag);
app.delete('/api/booktags/:id', api_booktag.deleteBookTag);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
