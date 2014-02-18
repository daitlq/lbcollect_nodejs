var categorySchema = require('./category.js');

//Schemas
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema

//Models
var ArticleSchema = new mongoose.Schema({
    title: String,
    author: String,
	category: {type: Schema.ObjectId, ref: 'Category'},
	time: String,
	short_desc: String,
	description: String
});
var Article = mongoose.model('Article', ArticleSchema);

var initSampleData = function() {
	var articles = [
	{
		title: "In Prison Release, Signs of Karzai’s Rift With U.S.",
		author: "Đoàn Trung Còn",
		time: "25/01/2015",
		short_desc: "American officials had lobbied intensely with Afghanistan to prevent the release of men they believed were insurgents.",
		description: "BAGRAM, Afghanistan — On Thursday at 9:10 a.m., the gates of the Bagram Prison swung open, and 65 men with long beards and new clothes walked out to freedom. The moment showed clearly just how thoroughly President Hamid Karzai had broken with the American military, here now 12 years. American officials had lobbied intensely with the Afghan government, first in private and then in increasingly acrimonious terms in public, to prevent the release of men they believed were not only dangerous insurgents with American and Afghan blood on their hands, but also men who would be convicted of that in an Afghan court of law. Instead, American soldiers on duty at Bagram could do nothing more than watch on closed-circuit television monitors as Afghan military police used Ford pickup trucks to ferry the prisoners to the nearest bazaar to catch taxis, saving them a mile-and-a-half walk. Prison authorities had given each man, in addition to clothes, warm coats and 5,000 afghanis, or about $90 — nearly half the base monthly salary of an Afghan police officer."
	}];
	articles.forEach(function(article) {
		articleModel = new Article(article);
		articleModel.save();
	});
}

exports.getAll = function(request, response) {
	//initSampleData();
	var queryString = request.query;
	if (queryString.title)
		queryString.title = new RegExp(queryString.title, 'i');

	Article.find(queryString).exec(function(err, articles) {
		if( !err ) {
			response.send(articles);
		} else {
			response.send({error: err});
		}
	});
}

exports.getById = function(request, response) {
    Article.findById(request.params.id).populate({
		path: 'category'
	}).exec(function(err, article){
		if (!err) {
			response.send(article);
		} else {
			response.send({error: err});
		}
    });    
}

exports.addArticle = function(request, response) {
	var article = new Article({
		title: request.body.title,
		author: request.body.author,
		category: request.body.category,
		time: request.body.time,
		short_desc: request.body.short_desc,
		description: request.body.description
	});
	article.save(function(err) {
		if(!err) {
			response.send(article);
		} else {
			response.send({error: err});
		}
	});
}

exports.updateArticle = function(request, response) {
	Article.findById(request.params.id, function(err, article) {
		article.title = request.body.title;
		article.author = request.body.author;
		article.category = request.body.category,
		article.time = request.body.time;
		article.short_desc = request.body.short_desc;
		article.description = request.body.description;

		article.save(function(err) {
			if(!err) {
				response.send(article);
			} else {
				response.send({error: err});
			}
		});
	});
}

exports.deleteArticle = function(request, response) {
	Article.findById(request.params.id, function(err, article) {
		article.remove(function(err) {
			if(!err) {
				response.send({success: true});
			} else {
				response.send({error: err});
			}
		});
	});
}