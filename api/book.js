//Schemas
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
	
//Models
var BookSchema = new mongoose.Schema({
    title: String,
    author: String,
	publisher: String,
	language: String,
    publication_year: Number,
	description: String
});

var Book = mongoose.model( 'Book', BookSchema );

var initSampleData = function() {
	var books = [
	{
		title: "Tứ thư",
		author: "Đoàn Trung Còn",
		publisher: "NXB Văn Hóa",
		language: "Việt Nam",
		publication_year: "2010",
		description: ""
	},
	{
		title: "Đạo Đức Kinh",
		author: "Lão Tử",
		publisher: "NXB Văn Hóa",
		language: "Việt Nam",
		publication_year: "2008",
		description: ""
	},
	{
		title: "Kinh Dịch",
		author: "Phan Bội Châu",
		publisher: "NXB Thanh Niên",
		language: "Việt Nam",
		publication_year: "2010",
		description: ""
	},
	{
		title: "Chu Dịch",
		author: "Nguyễn Văn Thọ",
		publisher: "NXB Trẻ",
		language: "Hoa-Việt",
		publication_year: "2000",
		description: ""
	},
	{
		title: "Cơ sở ngữ văn Hán-Nôm",
		author: "Lê Trí Viễn",
		publisher: "NXB Giáo Dục",
		language: "Việt Nam",
		publication_year: "2010",
		description: ""
	}];
	books.forEach(function(book) {
		bookModel = new Book(book);
		bookModel.save();
	});
}

exports.getAll = function(request, response) {
	//initSampleData();
	var queryString = request.query;
	if (queryString.title)
		queryString.title = new RegExp(queryString.title, 'i');

	Book.find(queryString).exec(function(err, books) {
		if( !err ) {
			response.send(books);
		} else {
			response.send({error: err});
		}
	});
}

exports.getById = function(request, response) {
    Book.findById(request.params.id, function(err, book){
		if (!err) {
			response.send(book);
		} else {
			response.send({error: err});
		}
    });    
}

exports.addBook = function(request, response) {
	var book = new Book({
		title: request.body.title,
		author: request.body.author,
		publisher: request.body.publisher,
		language: request.body.language,
		publication_year: request.body.publication_year,
		description: request.body.description
	});
	book.save(function(err) {
		if(!err) {
			response.send(book);
		} else {
			response.send({error: err});
		}
	});
}

exports.updateBook = function(request, response) {
	Book.findById(request.params.id, function(err, book) {
		book.title = request.body.title;
		book.author = request.body.author;
		book.publisher = request.body.publisher;
		book.language = request.body.language;
		book.publication_year = request.body.publication_year;
		book.description = request.body.description;

		book.save(function(err) {
			if(!err) {
				response.send(book);
			} else {
				response.send({error: err});
			}
		});
	});
}

exports.deleteBook = function(request, response) {
	Book.findById(request.params.id, function(err, book) {
		book.remove(function(err) {
			if(!err) {
				response.send({success: true});
			} else {
				response.send({error: err});
			}
		});
	});
}