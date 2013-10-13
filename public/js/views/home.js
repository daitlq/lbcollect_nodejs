window.HomeView = Backbone.View.extend({

	initialize:function() {
		debug('Initializing Home View');
	},

	render:function() {
		$(this.el).html(this.template());
		this.enable_search_ahead();
		return this;
	},
	
	enable_search_ahead:function() {
		$("#nav-search-input", this.el).typeahead({
			source:["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
			updater:function(a){
				$("#nav-search-input").focus();
				return a;
			}
		});
	}
});