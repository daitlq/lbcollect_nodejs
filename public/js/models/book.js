window.Book = Backbone.Model.extend({

	urlRoot: "api/books",

	defaults: {
		title: "",
		category: "",
		author: "",
		publisher: "",
		language: "",
		publication_year: "",
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

window.BookCollection = Backbone.Collection.extend({

	model: Book,

	url: "api/books",

	findByTitle: function(key) {
		var url = (key == '') ? 'api/books' : "api/books?title=" + key;
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