window.Router = Backbone.Router.extend({

	routes: {
		"": "home",
		"contact"	: "contact",
		"books"		: "getListBook",
		"books/add" : "addBook",
		"books/:id"	: "getBook",
		"books/edit/:id" : "editBook",
	},

	initialize: function() {
		if (!this.baseView) {
			this.baseView = new BaseView();
			this.baseView.render();
		} else {
			this.baseView.delegateEvents(); // delegate events when the view is recycled
		}
		$("#wrap-container").html(this.baseView.el);
	},

	home: function() {
		if (!this.homeView) {
			this.homeView = new HomeView();
			this.homeView.render();
		} else {
			this.homeView.delegateEvents();
		}
		$("#main-content").html(this.homeView.el);
	},
	
	contact: function() {
		if (!this.contactView) {
			this.contactView = new ContactView();
			this.contactView.render();
		}
		$("#main-content").html(this.contactView.el);
	},
	
	getListBook: function() {
		var bookList = new BookCollection();
		var self = this;
		bookList.fetch({
			success: function(books) {
				self.bookListView = new BookListView({collection: books});
				$("#main-content").html(self.bookListView.render().el);
			}
		});
	},
	
	getBook: function(id) {
		var book = new Book({id: id});
		book.fetch({
			success: function (data) {
				$("#main-content").html(new BookView({model: data}).render().el);
			}
		});
	},
	
	addBook: function() {
		var book = new Book();
		$('#main-content').html(new BookEditView({model: book}).render().el);
	},
	
	editBook: function(id) {
		var book = new Book({id: id});
		book.fetch({
			success: function (data) {
				$("#main-content").html(new BookEditView({model: data}).render().el);
			}
		});
	}
});

var mapTemplates = {
	"BaseView"			: "BaseView.html",
	"HomeView"			: "HomeView.html",
	"ContactView"		: "ContactView.html",
	"BookListView"		: "books/BookListView.html",
	"BookListItemView"	: "books/BookListItemView.html",
	"BookView"			: "books/BookView.html",
	"BookEditView"		: "books/BookEditView.html"
};

utils.loadTemplate([
						"BaseView", "HomeView", "ContactView", 
						"BookListView", "BookListItemView", "BookView", "BookEditView"
					],
	function () {
		app = new Router();
		Backbone.history.start();
	}
);