//Schemas
var bookSchema = require('./book.js');
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
	
//Models
var BookImageSchema = new mongoose.Schema({
    book_id: {type: Schema.ObjectId, ref: 'Book' },
	image: String
});
var BookImage = mongoose.model('BookImage', BookImageSchema);

var initSampleData = function() {
	var bookimages = [
	{
		book_id: "52a6d33ca199d95012000001",
		image: "IMG_0564.JPG"
	},
	{
		book_id: "52a6d33ca199d95012000002",
		image: "IMG_0565.JPG"
	}];
	bookimages.forEach(function(bookimage) {
		bookImageModel = new BookImage(bookimage);
		bookImageModel.save();
	});
}

exports.getAll = function(request, response) {
	var queryString = request.query;
	//initSampleData();
	BookImage.find(queryString).populate({
		path: 'book_id'
	}).exec(function(err, bookimages) {
		if( !err ) {
			response.send(bookimages);
		} else {
			console.log(err);
		}
	});
}

exports.addBookImage = function(request, response) {
	var bookImage = new BookImage({
		book_id: request.body.book_id,
		image: request.body.image
	});
	bookImage.save(function(err) {
		if(!err) {
			response.send(bookImage);
		} else {
			response.send({error: err});
		}
	});
}

exports.deleteBookImage = function(request, response) {
	BookImage.findById(request.params.id, function(err, bookImage) {
		bookImage.remove(function(err) {
			if(!err) {
				response.send({success: true});
			} else {
				response.send({error: err});
			}
		});
	});
}