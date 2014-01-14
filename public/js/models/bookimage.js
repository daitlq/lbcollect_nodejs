window.BookImage = Backbone.Model.extend({

	urlRoot: "api/bookimages",

	initialize: function() {
	}
});

window.BookImageCollection = Backbone.Collection.extend({

	model: BookImage,

	url: "api/bookimages",

	findByBook: function(key) {
		var url = (key == '') ? 'api/bookimages' : "api/bookimages?book_id=" + key;
		debug('findImagesByBookID: ' + key);
		var self = this;
		$.ajax({
			url: url,
			dataType: "json",
			success: function(data) {
				debug("search success: " + data.length);
				self.reset(data);
			}
		});
	}
});