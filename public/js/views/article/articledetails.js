window.ArticleView = Backbone.View.extend({

	events: {
		"click .icon-trash"   : "deleteArticle"
    },
	
	initialize: function() {
		debug('Initializing Article Details View');
	},

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
    },
	
	deleteArticle: function (event) {
		event.stopPropagation();
        event.preventDefault();
		this.model.destroy({
			success: function() {
				alert('This article was deleted successfully!');
				window.location.href = "#articles";
			}
		});
    }
});