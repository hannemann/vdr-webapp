/**
 * initialize main class
 * @constructor
 */
var VDRest = function () {
	this.current = null;
    this.initWithoutConfig = false;
};

/**
 * Check if necessary configuration is set
 * @return {*}
 */
VDRest.prototype.checkConfig = function () {

    return config.getItem('host') && config.getItem('port');
};

/**
 * modules buffer
 * @type {Object}
 */
VDRest.prototype.modules = {};

/**
 * destroy callbacks in cas of history is used
 * @type {Array}
 */
VDRest.prototype.destroyer = [];

/**
 * observe if location hash changes to observeHash
 * @type {Boolean|String}
 */
VDRest.prototype.observeHash = false;

/**
 * add module instance to buffer
 * @param module
 */
VDRest.prototype.registerModule = function (module, init) {

	this.modules[window.VDRest[module].prototype.name] = new window.VDRest[module]();
    if (init) {
        this.initModule(module);
    }
};

/**
 * determine if module is registered
 * @param module
 * @return {Boolean}
 */
VDRest.prototype.isRegistered = function (module) {
    return typeof this.modules[module] != 'undefined';
};

/**
 * entrypoint of programm
 */
VDRest.prototype.run = function () {
	var start = 'settings', i;

	start = config.getItem('start') || start;

    if (!this.initWithoutConfig) {

        this.initNoConfig();
    }
	if (this.checkConfig()) {

		for (i in this.modules) {

            if (this.modules.hasOwnProperty(i)) {

                this.initModule(i);
            }
		}

		this.dispatch(start);
        this.pollLocation();

	} else {

		this.getConfig();
	}
};

/**
 * retrieve location hash
 * @return {String}
 */
VDRest.prototype.getLocationHash = function () {
    return window.location.hash.replace('#', '');
};

/**
 * set location hash
 * @param hash
 * @return {*}
 */
VDRest.prototype.setLocationHash = function (hash) {

    window.location.hash = '#' + hash;
    return this;
};

/**
 * poll location hash and dispatch changes
 */
VDRest.prototype.pollLocation = function () {
    var start = config.getItem('start'), hash;

    setInterval($.proxy(function () {

        hash = this.getLocationHash();

        if ("" === hash) {

            hash = start;
        }

        if (hash !== this.current && this.isRegistered(hash)) {

            this.dispatch(hash, undefined);

        } else if (this.observeHash === hash) {

            this.observeHash = false;
            this.destroy();

        } else if (hash === this.current && this.destroyer.length > 0) {

            this.destroy();
        }

    }, this), 100);
};

/**
 * add destroyer method
 * @param destroyer
 */
VDRest.prototype.addDestroyer = function (destroyer, callback) {

    this.destroyer.push(destroyer);
    $(document).one(destroyer, callback);
};

/**
 * call last added destroyer
 */
VDRest.prototype.destroy = function () {

    var destroyer = this.destroyer.pop();

    $.event.trigger({
        "type" : destroyer,
        "skipHistoryBack" : true
    });
};

/**
 * call init method of module
 * @param module
 */
VDRest.prototype.initModule = function (module) {

    if ("undefined" === typeof this.modules[module].initialized) {

        this.modules[module].init();
        this.modules[module].initialized = true;
    }
};

/**
 * init modules that need to be initialized before config is loaded
 */
VDRest.prototype.initNoConfig = function () {
    var i;

    for (i in this.modules) {

        if (this.modules.hasOwnProperty(i) && typeof this.modules[i].noConfig !== 'undefined') {

            this.initModule(i);
        }
    }

    this.initWithoutConfig = true;
};

/**
 * main dispatcher
 * @param moduleName
 * @param callback
 */
VDRest.prototype.dispatch = function (moduleName, callback) {

	if (this.current != moduleName) {

        if (this.current && 'function' === typeof this.modules[this.current].destruct) {

            this.modules[this.current].destruct();
        }

        $.event.trigger({"type":"dispatchBefore"});

        $('.content').hide();
        $('body').scrollTop();
        if (moduleName !== this.getLocationHash()) {

            this.setLocationHash(moduleName);
        }
		this.modules[moduleName].dispatch(callback);
		this.current = moduleName;

        $.event.trigger({"type":"dispatchAfter"});
	}
};

/**
 * initiliaze settings module
 */
VDRest.prototype.getConfig = function () {

	this.modules['settings'].init();
	this.dispatch('settings', $.proxy(this.run, this));
};

/**
 * module getter
 * @param module
 * @return {*}
 */
VDRest.prototype.getModule = function (module) {

	if (typeof this.modules[module] != 'undefined') {

		return this.modules[module];
	}

	return false;
};

/**
 * retrieve current dispatched module name
 * @return {*}
 */
VDRest.prototype.getCurrent = function () {

    return this.current;
};

vdrest = new VDRest();

$(document).ready(function () {

	vdrest.run();
});
