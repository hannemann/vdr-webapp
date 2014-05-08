/**
 * @namespace
 */
var VDRest = function () {};

/**
 * @namespace
 */
VDRest.Abstract = function () {};

/**
 * @namespace
 */
VDRest.Lib = function () {};

/**
 * @namespace
 */
VDRest.Api = function () {};

/**
 * initialize main class
 * @constructor
 */
VDRest.App = function () {
	this.current = null;
    this.initWithoutConfig = false;
};

/**
 * Check if necessary VDRest.configuration is set
 * @return {*}
 */
VDRest.App.prototype.checkConfig = function () {

    return VDRest.config.getItem('host') && VDRest.config.getItem('port');
};

/**
 * modules buffer
 * @type {Object}
 */
VDRest.App.prototype.modules = {};

/**
 * destroy callbacks in cas of history is used
 * @type {Array}
 */
VDRest.App.prototype.destroyer = [];

/**
 * observe if location hash changes to observeHash
 * @type {Boolean|String}
 */
VDRest.App.prototype.observeHash = [];

/**
 * add module instance to buffer
 * @param {string} keys namespace and name of module to be instantiated
 * @param {boolean} init
 */
VDRest.App.prototype.registerModule = function (keys, init) {

    var namespace = keys.split('.')[0],
        module = keys.split('.')[1];

	this.modules[keys] = new window[namespace][module]();
    if (init) {
        this.initModule(keys);
    }
};

/**
 * determine if module is registered
 * @param module
 * @return {Boolean}
 */
VDRest.App.prototype.isRegistered = function (module) {
    return typeof this.modules[module] != 'undefined';
};

/**
 * entrypoint of programm
 */
VDRest.App.prototype.run = function () {
	var start = 'Gui.Config', i,
        startConfig = VDRest.config.getItem('start');

    this.language = VDRest.config.getItem('language');

    if (this.isRegistered(startConfig)) {

        start = startConfig;
    } else {

        VDRest.config.setItem('start', 'Gui.Epg');
        this.getModule('Gui.Menubar').getController('Default').initial = true;
        this.initial = true;
    }

    this.pollLocation();

    if (!this.initWithoutConfig) {

        this.initNoConfig();
    }
	if (this.checkConfig()) {

		for (i in this.modules) {

            if (this.modules.hasOwnProperty(i)) {

                this.initModule(i);
                this.initModuleLate(i);
            }
		}

		this.dispatch(start);

	} else {

		this.getConfig();
	}
};

/**
 * retrieve location hash
 * @return {String}
 */
VDRest.App.prototype.getLocationHash = function () {
    return window.location.hash.replace('#', '');
};

/**
 * set location hash
 * @param hash
 * @return {*}
 */
VDRest.App.prototype.setLocationHash = function (hash) {

    window.location.hash = '#' + hash;
    return this;
};

/**
 * poll location hash and dispatch changes
 */
VDRest.App.prototype.pollLocation = function () {
    var start = VDRest.config.getItem('start'), hash;

    setInterval($.proxy(function () {

        hash = this.getLocationHash();

        if ("" === hash) {

            hash = start;
        }

        if (hash !== this.current && this.isRegistered(hash)) {

            this.dispatch(hash);

        } else if (this.observeHash[this.observeHash.length-1] === hash) {

            this.destroy();

        }

        // Humbug?
        /*else if (hash === this.current && this.destroyer.length > 0) {

            this.destroy();
        }*/

    }, this), 100);
};

VDRest.App.prototype.observe = function (hash) {

    this.observeHash.push(hash || this.getLocationHash());
};

/**
 * add destroyer method
 * @param {string} destroyer
 * @param {function} callback
 */
VDRest.App.prototype.addDestroyer = function (destroyer, callback) {

    this.destroyer.push(destroyer);
    $(document).one(destroyer, callback);
};

/**
 * call last added destroyer
 */
VDRest.App.prototype.destroy = function () {

    var destroyer = this.destroyer.pop();
    this.observeHash.pop();

    if ("undefined" !== typeof destroyer) {

        $.event.trigger({
            "type" : destroyer,
            "skipHistoryBack" : true
        });
    }
};

/**
 * call init method of module
 * @param {string} module name of module to be initialized
 */
VDRest.App.prototype.initModule = function (module) {

    if ("undefined" === typeof this.modules[module].initialized) {

        this.modules[module].init();
        this.modules[module].initialized = true;
    }
};

/**
 * call late init method of module
 * @param {string} module name of module to be initialized
 */
VDRest.App.prototype.initModuleLate = function (module) {

    if (
        "undefined" === typeof this.modules[module].initializedLate
        && "function" === typeof this.modules[module].initLate
    ) {

        this.modules[module].initLate();
        this.modules[module].initializedLate = true;
    }
};

/**
 * init modules that need to be initialized before config is loaded
 */
VDRest.App.prototype.initNoConfig = function () {
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
 * @param {string} moduleName
 * @param {function} [callback]
 */
VDRest.App.prototype.dispatch = function (moduleName, callback) {

	if (this.current != moduleName) {

        if (this.current && 'function' === typeof this.modules[this.current].destruct) {

            this.modules[this.current].destruct();
        }

        $.event.trigger({
            "type":"dispatch.before",
            "payload" : this.modules[this.current]
        });

        if (moduleName !== this.getLocationHash()) {

            this.setLocationHash(moduleName);
        }
		this.modules[moduleName].dispatch(callback);
		this.current = moduleName;

        $.event.trigger({
            "type":"dispatch.after",
            "payload" : this.modules[this.current]
        });
	}
};

/**
 * initialize settings module
 */
VDRest.App.prototype.getConfig = function () {

//	this.modules['Gui.Config'].init();
	this.dispatch('Gui.Config', $.proxy(this.run, this));
};

/**
 * module getter
 * @param module
 * @return {*}
 */
VDRest.App.prototype.getModule = function (module) {

	if (typeof this.modules[module] != 'undefined') {

		return this.modules[module];
	}

	return false;
};

/**
 * retrieve current dispatched module name
 * @param {boolean} [asModule]
 * @return {string|VDRest.Abstract.Module}
 */
VDRest.App.prototype.getCurrent = function (asModule) {

    if (asModule) {

        return this.modules[this.current];
    }

    return this.current;
};

/**
 * get localized string if available
 * printf syntax is supported
 */
VDRest.App.prototype.translate = function () {

    var args = Array.prototype.slice.apply(arguments),
        key = args.shift();

    if (this[this.language] && this[this.language][key]) {

        return sprintf(this[this.language][key], args);
    }

    return key;
};

VDRest.app = new VDRest.App();

$(document).ready(function () {

	VDRest.app.run();
});
