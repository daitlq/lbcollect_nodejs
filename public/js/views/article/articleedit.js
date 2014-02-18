window.ArticleEditView = Backbone.View.extend({

	events: {
		"change"        	: "change",
        "click #btnSave"	: "save",
		"click #btnCancel"	: "cancelUpdate"
    },
	
	initialize: function() {
		debug('Initializing Article Edit View');
		this.bChangeDescription = false;
	},

	render: function() {
		var self = this;
		$(this.el).html(this.template(this.model.toJSON()));
		// rich text editor
		$('.ckeditor', this.el).ckeditor(function() {
			this.on('change', function(e) { self.bChangeDescription = true; });
		});
		
		// Load book's categories.
		this.loadCategories();
		
		return this;
    },
	
	loadCategories: function() {
		var self = this;
		var categoryList = new CategoryCollection();
		categoryList.fetch({
			success: function(categories) {
				_.each(categories.models, function(category) {
					$("#category", self.el).append("<option value='" + category.attributes._id + "'>" + category.attributes.name + "</option>");
				})
				$('#category', self.el).chosen({width: "220px"});
				if (self.model.id != null) {
					$('#category', self.el).val(self.model.attributes.category._id).trigger("chosen:updated");
					self.model.set({'category': self.model.attributes.category._id});
				} else {
					self.model.set({'category': $('#category', self.el).val()});
				}
			}
		});
	},
	
	change: function(event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
		
		change[target.name] = target.value;
		this.model.set(change);
		// Run validation rule (if any) on changed item
		var check = this.model.validateItem(target.id);
		if (check.isValid === false) {
			utils.addValidationError(target.id, check.message);
		} else {
			utils.removeValidationError(target.id);
		}
    },

	save: function() {
		if (this.bChangeDescription) {
			var change = {};
			change["description"] = CKEDITOR.instances['description'].getData();
			this.model.set(change);
		}
		
		this.model.save(null, {
			success: function(model) {
				utils.showAlert('Success!', 'Article saved successfully', 'alert-success');
				window.location.href = "#articles/" + model.attributes._id;
			},
			error: function () {
				utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
			}
		});
	},
	
	cancelUpdate: function() {
		window.history.back();
	}
});