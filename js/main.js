/**
 * initialize main class
 * @constructor
 */
Main = function () {
	this.current = null;
    this.initWithoutConfig = false;
};

/**
 * Check if necessary configuration is set
 * @return {*}
 */
Main.prototype.checkConfig = function () {
    return config.getItem('host') && config.getItem('port');
};

/**
 * modules buffer
 * @type {Object}
 */
Main.prototype.modules = {};

/**
 * add module instance to buffer
 * @param module
 */
Main.prototype.registerModule = function (module) {

    if ("undefined" === typeof window[module].prototype.name) {

        throw "Property name of module "+module+" is not defined";
    }

	this.modules[window[module].prototype.name] = new window[module]();
};

/**
 * determine if module is registered
 * @param module
 * @return {Boolean}
 */
Main.prototype.isRegistered = function (module) {
    return typeof this.modules[module] != 'undefined';
};

/**
 * entrypoint of programm
 */
Main.prototype.run = function () {
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
 * poll location hash and dispatch changes
 */
Main.prototype.pollLocation = function () {
    var start = config.getItem('start'), hash;

    setInterval($.proxy(function () {

        hash = window.location.hash.replace('#', '');

        if ("" === hash) {

            hash = start;
        }

        if (hash !== this.current && this.isRegistered(hash)) {

            this.dispatch(hash, undefined);

        } else if (hash === this.current && typeof this.destroy === 'function') {

            this.destroy();
            this.destroy = undefined;
        }

    }, this), 100);
};

/**
 * call init method of module
 * @param module
 */
Main.prototype.initModule = function (module) {

    if ("undefined" === typeof this.modules[module].initialized) {

        this.modules[module].init();
        this.modules[module].initialized = true;
    }
};

/**
 * init modules that need to be initialized before config is loaded
 */
Main.prototype.initNoConfig = function () {
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
 * @param module
 * @param callback
 */
Main.prototype.dispatch = function (module, callback) {

    if (this.isRegistered('drawer')) this.modules.drawer.close();

	if (this.current != module) {

        if (this.current && 'function' === typeof this.modules[this.current].destruct) {

            this.modules[this.current].destruct();
        }

        if (this.isRegistered('drawer')) {

            this.modules.drawer.setCurrent(module);
        }

        $('.content').hide();
        $('body').scrollTop();
        if ('#'+module !== window.location.hash) {

            window.location.hash = '#'+module;
        }
		this.modules[module].dispatch(callback);
		this.current = module;
	}
};

/**
 * initiliaze settings module
 */
Main.prototype.getConfig = function () {

	this.modules['settings'].init();
	this.dispatch('settings', $.proxy(this.run, this));
};

/**
 * module getter
 * @param module
 * @return {*}
 */
Main.prototype.getModule = function (module) {

	if (typeof this.modules[module] != 'undefined') {

		return this.modules[module];
	}

	return false;
};

main = new Main();

$(document).ready(function () {

	main.run();
});
