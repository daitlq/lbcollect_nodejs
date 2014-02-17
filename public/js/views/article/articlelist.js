window.ArticleListView = Backbone.View.extend({

	events: {
		"keyup .search-query": "search",
		"keypress .search-query": "onkeypress"
    },
	
	initialize: function() {
		debug('Initializing Article List View');
		this.collection.bind("reset", this.render, this);
		$(this.el).html(this.template());
	},

	render: function() {
		$('#pnl_article', this.el).empty();;
		_.each(this.collection.models, function (article) {
			$('#pnl_article', this.el).append(new ArticleListItemView({model:article}).render().el);
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

window.ArticleListItemView = Backbone.View.extend({

	className: "span",
	
	initialize: function() {
		this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.close, this);
	},

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}

});