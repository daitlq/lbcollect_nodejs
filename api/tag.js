//Schemas
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
	
//Models
var TagSchema = new mongoose.Schema({
    name: String
});
var Tag = mongoose.model('Tag', TagSchema);

var initSampleData = function() {
	var tags = [
	{ name: "Kinh Dịch" },
	{ name: "Triết Học" },
	{ name: "Lịch Sử" },
	{ name: "Tôn Giáo" },
	{ name: "Từ Điển" },
	{ name: "Tạp Chí" },
	{ name: "Văn Học" }];
	tags.forEach(function(tag) {
		tagModel = new Tag(tag);
		tagModel.save();
	});
}

exports.getAll = function(request, response) {
	//initSampleData();
	Tag.find().exec(function(err, tags) {
		if( !err ) {
			response.send(tags);
		} else {
			console.log(err);
		}
	});
}