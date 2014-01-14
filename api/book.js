//Schemas
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema

var formidable = require('formidable'),
    util = require('util');

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

exports.uploadImage = function(request, response) {
	// parse a file upload
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.uploadDir ='./data/collection/books';
	form
		.on('error', function(err) {
			throw err;
		})
		.on('field', function(field, value) {
			//receive form fields here
		})
		/* this is where the renaming happens */
		.on ('fileBegin', function(name, file){
			//rename the incoming file to the file's name
			file.path = form.uploadDir + "/" + file.name;
		})
		.on('file', function(field, file) {
			//On file received
		})
		.on('progress', function(bytesReceived, bytesExpected) {
			//self.emit('progess', bytesReceived, bytesExpected)
			var percent = (bytesReceived / bytesExpected * 100) | 0;
			process.stdout.write('Uploading: %' + percent + '\r');
		})
		.on('end', function() {

		});

	form.parse(request, function(err, fields, files) {
	/*
		response.writeHead(200, {'content-type': 'text/plain'});
		response.write('received upload:\n\n');
		response.end(util.inspect({fields: fields, files: files}));*/
		response.send({success: true, files: files});
    });
}