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
		this.loadImage();
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
    },
	
	connector: function(itemNavigation, carouselStage) {
        return carouselStage.jcarousel('items').eq(itemNavigation.index());
    },
	
	loadImage: function() {
		var self = this;
		// Setup the carousels. Adjust the options for both carousels here.
        var carouselStage      = $('.carousel-stage', this.el).jcarousel();
        var carouselNavigation = $('.carousel-navigation', this.el).jcarousel();

        // We loop through the items of the navigation carousel and set it up
        // as a control for an item from the stage carousel.
        carouselNavigation.jcarousel('items').each(function() {
            var item = $(this);

            // This is where we actually connect to items.
            var target = self.connector(item, carouselStage);

            item
                .on('jcarouselcontrol:active', function() {
                    carouselNavigation.jcarousel('scrollIntoView', this);
                    item.addClass('active');
                })
                .on('jcarouselcontrol:inactive', function() {
                    item.removeClass('active');
                })
                .jcarouselControl({
                    target: target,
                    carousel: carouselStage
                });
        });

        // Setup controls for the stage carousel
        $('.prev-stage', this.el)
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

        $('.next-stage', this.el)
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });

        // Setup controls for the navigation carousel
        $('.prev-navigation', this.el)
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

        $('.next-navigation', this.el)
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });
	}
});