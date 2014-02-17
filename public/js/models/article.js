window.Article = Backbone.Model.extend({

	urlRoot: "api/articles",

	defaults: {
		title: "",
		author: "",
		time: "",
		short_desc: "",
		description: ""
	},
	
	initialize: function() {
		this.validators = {};

		this.validators.title = function(value) {
			return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a title"};
		}
	},
	
	validateItem: function(key) {
		return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
	}
});

window.ArticleCollection = Backbone.Collection.extend({

	model: Article,

	url: "api/articles",

	findByTitle: function(key) {
		var url = (key == '') ? 'api/articles' : "api/articles?title=" + key;
		debug('findByTitle: ' + key);
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