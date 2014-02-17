
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
app.set('port', process.env.PORT || 8888);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.json());
//app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'data')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Article
api_article = require('./api/article');
app.get('/api/articles', api_article.getAll);
app.get('/api/articles/:id', api_article.getById);
app.post('/api/articles', api_article.addArticle);
app.put('/api/articles/:id', api_article.updateArticle);
app.delete('/api/articles/:id', api_article.deleteArticle);

// book
api_book = require('./api/book');
app.get('/api/books', api_book.getAll);
app.get('/api/books/:id', api_book.getById);
app.post('/api/books', api_book.addBook);
app.put('/api/books/:id', api_book.updateBook);
app.delete('/api/books/:id', api_book.deleteBook);
app.post('/api/books/upload', api_book.uploadImage);

// tag
api_tag = require('./api/tag');
app.get('/api/tags', api_tag.getAll);

// booktag
api_booktag = require('./api/booktag');
app.get('/api/booktags', api_booktag.getAll);
app.post('/api/booktags', api_booktag.addBookTag);
app.delete('/api/booktags/:id', api_booktag.deleteBookTag);

// bookimage
api_bookimage = require('./api/bok_image');
app.get('/api/bookimages', api_bookimage.getAll);
app.post('/api/bookimages', api_bookimage.addBookImage);
app.delete('/api/bookimages/:id', api_bookimage.deleteBookImage);

// create server
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
