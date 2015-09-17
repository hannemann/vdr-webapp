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
    window.addEventListener('popstate', this.handlePopState.bind(this));
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
 * store callbacks for history action
 * @type {Object.<function>}
 */
VDRest.App.prototype.historyCallbacks = {};

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

    //this.startedFullscreen = VDRest.helper.getIsFullscreen();

    if (this.isRegistered(startConfig)) {

        start = startConfig;
    } else {

        VDRest.config.setItem('start', 'Gui.Epg');
        this.getModule('Gui.Menubar').getController('Default').initial = true;
        this.initial = true;
    }

    this.startModule = start;

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
 * retrieve location pathname
 * @return {String}
 */
VDRest.App.prototype.getLocationSearch = function () {
    return window.location.search.replace('?', '');
};

/**
 * push history state
 * @param {string} path
 * @param {function} [callback]
 * @return {VDRest.App}
 */
VDRest.App.prototype.pushHistoryState = function (path, callback) {

    var currentState;

    if ("function" === typeof callback) {
        this.historyCallbacks[path] = callback;
        currentState = history.state;
        currentState.callback = path;
        this.replaceHistoryState(currentState);
    }
    history.pushState(this.getHistoryState(), document.title, '/?' + path);
    return this;
};

/**
 * @param {Object.<number|string>} state
 */
VDRest.App.prototype.replaceHistoryState = function (state) {

    history.replaceState(state, document.title, '/?' + this.getLocationSearch());
};

VDRest.App.prototype.addHistoryStateInfo = function (info) {

    var currentState = history.state;
    currentState.info = info;
    this.replaceHistoryState(currentState);
};

/**
 * retrieve current state
 * @return {Object.<string|number>}
 */
VDRest.App.prototype.getHistoryState = function () {

    return {
        "module" : this.getCurrent(),
        "windows" : this.getModule('Gui.Window').windowNames
    };
};

/**
 * @param {Event} e
 * @param {Object.<string|number>} e.state
 */
VDRest.App.prototype.handlePopState = function (e) {

    var winModule = this.getModule('Gui.Window'), currentState;

    if (!e.state) return;

    VDRest.helper.log(e.state);

    if (this.noHistoryAction) {
        this.noHistoryAction = false;
        return;
    }

    if (e.state.callback) {

        this.historyCallbacks[e.state.callback]();
        delete this.historyCallbacks[e.state.callback];
        currentState = history.state;
        delete currentState.callback;
        this.replaceHistoryState(currentState);

    } else if (winModule.windows.length > 0) {

        winModule.getLastRegister().destructView();
        winModule.popRegister();
        $.event.trigger({
            "type" : "window.close"
        });

    } else if (e.state.info) {

        if (e.state.info.fireEvent) {

            $.event.trigger(e.state.info.fireEvent);
        }

    } else {

        this.dispatch(e.state.module);
    }
};

/**
 * flag no history action
 */
VDRest.App.prototype.setNoHistoryActionFlag = function () {

    this.noHistoryAction = true;
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


		this.modules[moduleName].dispatch(callback);
		this.current = moduleName;

        if (this.startup) {

            history.replaceState({"module": moduleName}, document.title, location.pathname);

        } else if (this.canModifyState(moduleName)) {

            this.pushHistoryState(moduleName);
        }
        this.startup = false;

        $.event.trigger({
            "type":"dispatch.after",
            "payload" : this.modules[this.current]
        });
	} else if (this.getLocationSearch().indexOf('Window-') === 0) {

        $.event.trigger({
            "type" : "window.request",
            "payload" : {
                "type" : this.getLocationSearch().replace('Window-', '')
            }
        });
    }
};

/**
 * determine if module can dispatch
 * @param {string} moduleName
 * @return {boolean}
 */
VDRest.App.prototype.canModifyState = function (moduleName) {

    var locPath = this.getLocationSearch();

    return moduleName !== locPath && !(locPath === '' && moduleName === this.startModule);
};

/**
 * initialize settings module
 */
VDRest.App.prototype.getConfig = function () {

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
