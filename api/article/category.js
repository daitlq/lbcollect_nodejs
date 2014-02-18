//Schemas
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema

//Models
var CategorySchema = new mongoose.Schema({
	name: String,
	description: String
});
var Category = mongoose.model('Category', CategorySchema);

var initSampleData = function() {
	var categories = [
	{
		name: "Triết học",
		description: ""
	},
	{
		name: "Văn học",
		description: ""
	},
	{
		name: "Lịch sử",
		description: ""
	},
	{
		name: "Khoa học máy tính",
		description: ""
	},
	{
		name: "Dịch học",
		description: ""
	}];
	categories.forEach(function(categorie) {
		categorieModel = new Category(categorie);
		categorieModel.save();
	});
}

exports.getAll = function(request, response) {
	//initSampleData();
	var queryString = request.query;
	if (queryString.title)
		queryString.title = new RegExp(queryString.title, 'i');

	Category.find(queryString).exec(function(err, categories) {
		if( !err ) {
			response.send(categories);
		} else {
			response.send({error: err});
		}
	});
}

exports.getById = function(request, response) {
    Category.findById(request.params.id, function(err, category){
		if (!err) {
			response.send(category);
		} else {
			response.send({error: err});
		}
    });    
}