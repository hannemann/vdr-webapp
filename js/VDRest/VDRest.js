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

    document.getElementById('splash').parentNode.removeChild(document.getElementById('splash'));

    this.language = VDRest.config.getItem('language');

    this.startedFullscreen = VDRest.helper.getIsFullscreen();

    if (this.isRegistered(startConfig)) {

        start = startConfig;
    } else {

        VDRest.config.setItem('start', 'Gui.Epg');
        this.getModule('Gui.Menubar').getController('Default').initial = true;
        this.initial = true;
    }

    if ("object" === typeof window.onhashchange) {
        window.addEventListener('hashchange', this.locationChange.bind(this));

    } else {
        this.pollLocation();
    }

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

        $document.one('infoupdate', function () {

            VDRest.info = this.getModule('VDRest.Info').getModel('Info');
            this.startup = true;
            this.dispatch(start);

        }.bind(this));

        $.event.trigger('updateinfo');

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

    if (this.replaceLocation) {
        this.replaceLocation = undefined;
        window.location.replace(window.location.href.replace(/(#.*$|$)/, '#' + hash));
    } else {
        window.location.hash = '#' + hash;
    }

    return this;
};

/**
 * poll location hash and dispatch changes
 */
VDRest.App.prototype.pollLocation = function () {

    setInterval(function () {

        this.locationChange();
    }.bind(this), 100);
};

/**
 * react on location change event
 */
VDRest.App.prototype.locationChange = function () {
    var start = VDRest.config.getItem('start'), hash;

    hash = this.getLocationHash();

    if ("" === hash) {

        hash = start;
    }

    if (hash !== this.current && this.isRegistered(hash)) {

        this.dispatch(hash);

    }
    if (this.observeHash[this.observeHash.length-1] === hash) {

        this.destroy();

    }

};

/**
 * Method adds callback to queue that is called if eventName is fired
 *
 * @param {String} eventName
 * @param {Function} callback
 * @param {String} newState
 */
VDRest.App.prototype.saveHistoryState = function (eventName, callback, newState) {

    this.addDestroyer(eventName, callback);
    this.observe();
    this.setLocationHash(newState);

};

/**
 * remove callback and hash
 * @param {string} eventName
 * @param {string} state
 */
VDRest.App.prototype.removeHistoryState = function (eventName, state) {

    this.observeHash.splice(
        this.observeHash.indexOf(state), 1
    );
    this.destroyer.splice(
        this.destroyer.indexOf(eventName), 1
    );

};

VDRest.App.prototype.observe = function (hash) {

    this.observeHash.push(hash || this.getLocationHash() || VDRest.config.getItem('start'));
};

/**
 * add destroyer method
 * @param {string} destroyer
 * @param {function} callback
 */
VDRest.App.prototype.addDestroyer = function (destroyer, callback) {

    this.destroyer.push(destroyer);
    $document.one(destroyer, callback);
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

            if (this.startup) {
                this.startup = false;
                this.replaceLocation = true;
            }
            this.setLocationHash(moduleName);
        }
        this.startup = false;
        this.replaceLocation = false;
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
    this.dispatch('Gui.Config', this.run.bind(this));
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
 * @returns {String}
 */
VDRest.App.prototype.translate = function () {

    var args = Array.prototype.slice.apply(arguments),
        /** @type {String} */
        key = args.shift();

    if (this[this.language] && this[this.language][key]) {

        args.unshift(this[this.language][key]);
        return sprintf.apply(window, args);
    }

    args.unshift(key);
    return sprintf.apply(window, args);
};

VDRest.app = new VDRest.App();

$document = $(document);
$window = $(window);

$document.ready(function () {

	VDRest.app.run();
});
