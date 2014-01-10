window.BookEditView = Backbone.View.extend({

	events: {
		"change"        	: "change",
        "click #btnSave"	: "save",
		"submit #frmUpload"	: "upload",
		"click #btnCancel"	: "cancelUpdate"
    },
	
	initialize: function() {
		debug('Initializing Book Edit View');
		this.bookTags = new BookTagCollection();
		if (this.model.id != null) {
			this.bookTags.bind("reset", this.loadSelectedTags, this);
		}
		this.bChangeTag = false;
		this.bChangeDescription = false;
	},

	render: function() {
		var self = this;
		$(this.el).html(this.template(this.model.toJSON()));
		//rich text editor
		$('.ckeditor', this.el).ckeditor(function() {
			this.on('change', function(e) { self.bChangeDescription = true; });
		});
		
		this.loadAllTags();
		return this;
    },
	
	loadAllTags: function() {
		var self = this;
		var tagList = new TagCollection();
		tagList.fetch({
			success: function(tags) {
				_.each(tags.models, function(tag) {
					$("#tag", self.el).append("<option value='" + tag.attributes._id + "'>" + tag.attributes.name + "</option>");
				})
				$('#tag', this.el).chosen({width: "220px"});
				if (self.model.id != null) {
					self.bookTags.findByBook(self.model.id);
				}
			}
		});
	},
	
	loadSelectedTags: function() {
		var arrTagSelected = new Array();
		_.each(this.bookTags.models, function(bookTag) {
			arrTagSelected.push(bookTag.attributes.tag_id._id);
		});
		$("#tag", this.el).val(arrTagSelected).trigger("chosen:updated");
	},
	
	change: function(event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
		
		if (target.name == "tag") {
			this.bChangeTag = true;
		} else {
			change[target.name] = target.value;
			this.model.set(change);
			// Run validation rule (if any) on changed item
			var check = this.model.validateItem(target.id);
			if (check.isValid === false) {
				utils.addValidationError(target.id, check.message);
			} else {
				utils.removeValidationError(target.id);
			}
		}
    },

	save: function() {
		if (this.bChangeDescription) {
			var change = {};
			change["description"] = CKEDITOR.instances['description'].getData();
			this.model.set(change);
		}
		var self = this;
		this.model.save(null, {
			success: function(model) {
				if (self.bChangeTag) {
					self.updateBookTag(model);
				} else {
					utils.showAlert('Success!', 'Book saved successfully', 'alert-success');
					window.location.href = "#books/" + model.attributes._id;
				}
			},
			error: function () {
				utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
			}
		});
	},
	
	updateBookTag: function(model) {
		var arrBookTagID = $("#tag", this.el).val();
		// remove old BookTags.
		if (this.model.id != null) {
			var bookTagModels = this.bookTags.models;
			for (var i = bookTagModels.length - 1; i >= 0; i--) {
				bookTag = new BookTag({id:bookTagModels[i].attributes._id});
				bookTag.destroy();
			}
		}
		
		// add new BookTags.
		_.each(arrBookTagID, function(bookTagID) {
			var bookTag = new BookTag();
			bookTag.set({book_id: model.attributes._id, tag_id: bookTagID});
			bookTag.save();
		});
		utils.showAlert('Success!', 'Book saved successfully', 'alert-success');
		window.location.href = "#books/" + model.attributes._id;
	},
	
	cancelUpdate: function() {
		window.history.back();
	},
	
	upload: function(event) {
		event.preventDefault();
		$("#frmUpload").ajaxSubmit({
			url: '/api/books/upload', 
			type: 'post',
			success: function(data) {
				console.log(data['files']);
			}
		});
	}
});