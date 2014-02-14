window.BookListView = Backbone.View.extend({

	events: {
		"keyup .search-query": "search",
		"keypress .search-query": "onkeypress"
    },
	
	initialize: function() {
		debug('Initializing Book View');
		this.collection.bind("reset", this.render, this);
		$(this.el).html(this.template());
	},

	render: function() {
		$('.thumbnails', this.el).empty();;
		_.each(this.collection.models, function (book) {
			$('.thumbnails', this.el).append(new BookListItemView({model:book}).render().el);
		}, this);
		return this;
	},
	
	search: function () {
		var key = $('#nav-search-input').val();
		debug('search ' + key);
		this.collection.findByTitle(key);
	},
	
	onkeypress: function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	}
});

window.BookListItemView = Backbone.View.extend({

	tagName: "li",

	className: "span3",

	initialize: function() {
		this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.close, this);
		
		this.bookImages = new BookImageCollection();
		this.bookImages.bind("reset", this.loadRandomThumbBookImage, this);
	},

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()));
		
		this.bookImages.findByBook(this.model.attributes._id);

		return this;
	},
	
	loadRandomThumbBookImage: function() {
		if (this.bookImages.models.length > 0) {
			var index = Math.floor(Math.random() * this.bookImages.models.length);
			$("img", this.el).attr("src", './collection/books/' + this.bookImages.models[index].attributes.image);
		}
	}
});