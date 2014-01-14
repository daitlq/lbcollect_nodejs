window.BookEditView = Backbone.View.extend({

	events: {
		"change"        	: "change",
        "click #btnSave"	: "save",
		"click #btnAddImage": "addImage",
		"click #btnCancel"	: "cancelUpdate"
    },
	
	initialize: function() {
		debug('Initializing Book Edit View');
		this.bookTags = new BookTagCollection();
		this.bookImages = new BookImageCollection();
		if (this.model.id != null) {
			this.bookTags.bind("reset", this.loadSelectedTags, this);
			this.bookImages.bind("reset", this.loadBookImage, this);
		}
		this.bChangeTag = false;
		this.bChangeDescription = false;
	},

	render: function() {
		var self = this;
		$(this.el).html(this.template(this.model.toJSON()));
		
		// load images of book
		if (this.model.id != null)
			this.bookImages.findByBook(this.model.id);
		
		// rich text editor
		$('.ckeditor', this.el).ckeditor(function() {
			this.on('change', function(e) { self.bChangeDescription = true; });
		});
		
		// Load book's tag.
		this.loadAllTags();
		return this;
    },
	
	loadBookImage: function() {
		var self = this;
		
		// show panel book
		$("#panel-image", this.el).removeClass('hide');
		
		if (this.bookImages.models.length == 0)
			$("#book-album", this.el).addClass('hide');
		else {
			$("#book-album", this.el).removeClass('hide');
		
			// load book's image
			$("#list-book-image", this.el).html('');
			_.each(this.bookImages.models, function(bookimage) {
				$("#list-book-image", self.el).append('<li><img src="./collection/books/' + bookimage.attributes.image + '" alt="' + bookimage.attributes.image+ '"></li>');
			}, this);
			
			$('.jcarousel', this.el).jcarousel({
					wrap: 'circular'
				});
				
			$('.jcarousel-pagination', this.el)
				.on('jcarouselpagination:active', 'a', function() {
					$(this).addClass('active');
				})
				.on('jcarouselpagination:inactive', 'a', function() {
					$(this).removeClass('active');
				})
				.on('click', function(e) {
					e.preventDefault();
				})
				.jcarouselPagination({
					perPage: 1,
					item: function(page) {
					return '<a href="#' + page + '">' + page + '</a>';
					}
				});
				
			if (this.bookImages.models.length > 4) {
				$(".jcarousel-control-prev", this.el).removeClass('hide');
				$(".jcarousel-control-next", this.el).removeClass('hide');
				
				$('.jcarousel-control-prev', this.el)
					.jcarouselControl({
					target: '-=1'
				});

				$('.jcarousel-control-next', this.el)
					.jcarouselControl({
					target: '+=1'
				});
			} else {
				$(".jcarousel-control-prev", this.el).addClass('hide');
				$(".jcarousel-control-next", this.el).addClass('hide');
			}
		}
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
		// Update book's tag on multichoice control.
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
	
	addImage: function(event) {
		// Upload modal
		this.initUploadModal();
		$("#dlg-list-book-image", self.el).html('');
		_.each(this.bookImages.models, function(bookimage) {
			$("#dlg-list-book-image", self.el).append('<div class="span3 thumbnail"><img src="./collection/books/'+ bookimage.attributes.image + '" alt="' + bookimage.attributes.image + '"></div>');
		}, this);
		$("#dlg-upload-form").dialog("open");
	},
	
	initUploadModal: function() {
		var self = this;
		var options = {
			buttons: {}
		};
		$("#dlg-upload-form", this.el).dialog({
			autoOpen: false,
			height: 450,
			width: 650,
			modal: true,
			buttons: {
				Upload: function() {
					$("#frmUpload").ajaxSubmit({
						url: '/api/books/upload', 
						type: 'post',
						success: function(data) {
							// successful upload book's image to server
							$("#dlg-list-book-image", this.el).append('<div class="span3 thumbnail"><img src="./collection/books/'+ data.files.upload.name + '" alt="' + data.files.upload.name + '"></div>');
														
							// add book's image to database
							var bookImage = new BookImage();
							bookImage.set({book_id: self.model.attributes._id, image: data.files.upload.name});
							bookImage.save(null, {
								success: function() {
									self.bookImages.findByBook(self.model.attributes._id);
								}
							});
						}
					});
				},
				Cancel: function() {
					$(this).dialog("close");
					$(this).dialog("destroy");
				}
			}
		});
	},
});