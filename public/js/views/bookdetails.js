window.BookView = Backbone.View.extend({

	events: {
		"click .icon-trash"   : "deleteBook"
    },
	
	initialize: function() {
		debug('Initializing Book Details View');
		this.bookTags = new BookTagCollection();
		this.bookTags.bind("reset", this.updateBookTag, this);
	},

	render: function() {
		$(this.el).html(this.template(this.model.toJSON()));
		this.bookTags.findByBook(this.model.id);
		return this;
    },
	
	updateBookTag: function() {
		var self = this;
		_.each(this.bookTags.models, function(booktag) {
			$('#tag', self.el).append('<a href="">' + booktag.attributes.tag_id.name + '</a>&nbsp;&nbsp;');
		}, this);
	},
	
	deleteBook: function (event) {
		event.stopPropagation();
        event.preventDefault();
		this.model.destroy({
			success: function() {
				alert('This book was deleted successfully!');
				window.location.href = "#books";
			}
		});
    }
});