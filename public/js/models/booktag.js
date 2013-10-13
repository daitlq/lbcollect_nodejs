window.Tag = Backbone.Model.extend({

	urlRoot: "api/tags",

	initialize: function() {
	}
});

window.TagCollection = Backbone.Collection.extend({

	model: Tag,

	url: "api/tags"
});

window.BookTag = Backbone.Model.extend({

	urlRoot: "api/booktags",

	initialize: function() {
	}
});

window.BookTagCollection = Backbone.Collection.extend({

	model: BookTag,

	url: "api/booktags",

	findByBook: function(key) {
		var url = (key == '') ? 'api/booktags' : "api/booktags?book_id=" + key;
		debug('findTagsByBookID: ' + key);
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