// The Template Loader. Used to asynchronously load templates located in separate .html files
window.utils = {

    loadTemplate: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {
                deferreds.push($.get('tpl/' + mapTemplates[view], function(data) {
                    window[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },
	
	displayValidationErrors: function (messages) {
		for (var key in messages) {
			if (messages.hasOwnProperty(key)) {
				this.addValidationError(key, messages[key]);
			}
		}
		this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
	},

	addValidationError: function (field, message) {
		var controlGroup = $('#' + field).parent().parent();
		controlGroup.addClass('error');
		$('.help-inline', controlGroup).html(message);
	},

	removeValidationError: function (field) {
		var controlGroup = $('#' + field).parent().parent();
		controlGroup.removeClass('error');
		$('.help-inline', controlGroup).html('');
	},

	showAlert: function(title, text, klass) {
		$('.alert').removeClass("alert-error alert-warning alert-success alert-info");
		$('.alert').addClass(klass);
		$('.alert').html('<strong>' + title + '</strong> ' + text);
		$('.alert').show();
	},

	hideAlert: function() {
		$('.alert').hide();
	}

};

DEBUG = true;

// Show log
debug = function(message) {
	if (DEBUG)
		console.log(message);
};