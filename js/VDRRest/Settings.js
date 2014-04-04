VDRest.Settings = function () {
	this.isDispatched = false;
};

VDRest.Settings.prototype.optionName = 'Einstellungen';

VDRest.Settings.prototype.name = 'settings';

VDRest.Settings.prototype.fields = ['host', 'port', 'start'];

/**
 * init settings page
 */
VDRest.Settings.prototype.init = function () {
	this.dom = $('.settings-wrapper');
	this.cancel = this.dom.find('.cancel');
	this.submit = this.dom.find('.submit');
};

/**
 * add events
 */
VDRest.Settings.prototype.addDomEvents = function () {
	this.cancel.on('click', function () {
		if (typeof this.callback === 'function') {
			this.callback();
		} else {
            window.history.back();
        }
	});
	this.submit.on('click', $.proxy(function () {
		this.persist();
        window.history.back();
	}, this));
};

/**
 * dispatch settings page
 * @param callback
 */
VDRest.Settings.prototype.dispatch = function (callback) {
	var i=0, l=this.fields.length, options, o, field;
	this.callback = callback;
	if (!this.isDispatched) {
		for (i;i<l;i++) {
			field = this.dom.find('[name="'+this.fields[i]+'"]');
			if (field.is('select')) {
				options = eval(field.attr('data-provider'));
				if (options instanceof Object) {
					for (o in options) {
                        if (options.hasOwnProperty(o)) {
                            if (typeof options[o][field.attr('data-attribute')] != 'undefined') {
                                field.append('<option value="'+o+'">'+options[o][field.attr('data-attribute')]+'</option>');
                            }
                        }
					}
				}
			}
			field.val(config.getItem(this.fields[i]));
		}
		this.isDispatched = true;
	}
	this.dom.show();
	this.addDomEvents();
};

/**
 * save changes
 */
VDRest.Settings.prototype.persist = function () {
	var i=0; l=this.fields.length;
	for (i;i<l;i++) {
		config.setItem(this.fields[i], this.dom.find('[name="'+this.fields[i]+'"]').val());
	}
	if (typeof this.callback === 'function') {
		this.callback();
	}
};

VDRest.app.registerModule('Settings');
