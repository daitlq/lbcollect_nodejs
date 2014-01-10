window.BaseView = Backbone.View.extend({

	initialize:function () {
		debug('Initializing Base View');
	},
	
	events:{
        "click #sidebar-collapse": "toggleMenu",
		"click .nav-list": "collapseSubMenu",
		"click #main-menu":"changeMenuItem"
    },
	
	render:function () {
		$(this.el).html(this.template());
		return this;
	},
	
	toggleMenu:function() {
		$("#sidebar").toggleClass("menu-min");
		this.menuIsToggle = $("#sidebar").hasClass("menu-min");
		if(this.menuIsToggle){
			$(".open > .submenu").removeClass("open")
		}
	},
	
	collapseSubMenu:function(event) {
		if(this.menuIsToggle)
			return;
		var c= $(event.target).closest(".dropdown-toggle");
		if(c&&c.length>0) {
			var b=c.next().get(0);
			if(!$(b).is(":visible")) {
				$(".open > .submenu").each(function() {
					if(this!=b&&!$(this.parentNode).hasClass("active")) {
						$(this).slideUp(200).parent().removeClass("open")
					}
				})
			}
			$(b).slideToggle(200).parent().toggleClass("open");return false
		}
	},
	
	changeMenuItem: function(event) {
		var menuItem = $(event.target).closest("li");
		if ($(menuItem).find("ul").length > 0)
			return;
			
		$("li", "#main-menu").each(function() {
			if ($(this).hasClass("active"))
				$(this).removeClass("active");
		});
		
		if ($(menuItem).closest("ul").hasClass("submenu"))
			$(menuItem).closest("ul").parent().addClass("active");
		menuItem.addClass("active");
	}

});