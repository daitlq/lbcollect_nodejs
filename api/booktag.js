//Schemas
var bookSchema = require('./book.js');
var tagSchema = require('./tag.js');

var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
	
//Models
var BookTagSchema = new mongoose.Schema({
    book_id: {type: Schema.ObjectId, ref: 'Book' },
	tag_id: {type: Schema.ObjectId, ref: 'Tag' }
});
var BookTag = mongoose.model('BookTag', BookTagSchema);

var initSampleData = function() {
	var booktags = [
	{
		book_id: "52591b4345e5de0412000001",
		tag_id: "525937f0ab42a76c0f000001"
	},
	{
		book_id: "52591b4345e5de0412000001",
		tag_id: "525937f0ab42a76c0f000002"
	}];
	booktags.forEach(function(booktag) {
		bookTagModel = new BookTag(booktag);
		bookTagModel.save();
	});
}

exports.getAll = function(request, response) {
	var queryString = request.query;
	
	BookTag.find(queryString).populate({
		path: 'tag_id',
		select: 'name'
	}).exec(function(err, booktags) {
		if( !err ) {
			response.send(booktags);
		} else {
			console.log(err);
		}
	});
}

exports.addBookTag = function(request, response) {
	var bookTag = new BookTag({
		book_id: request.body.book_id,
		tag_id: request.body.tag_id
	});
	bookTag.save(function(err) {
		if(!err) {
			response.send(bookTag);
		} else {
			response.send({error: err});
		}
	});
}

exports.deleteBookTag = function(request, response) {
	BookTag.findById(request.params.id, function(err, bookTag) {
		bookTag.remove(function(err) {
			if(!err) {
				response.send({success: true});
			} else {
				response.send({error: err});
			}
		});
	});
}