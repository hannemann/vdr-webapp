Main = function () {
	this.current = null;
    this.initWithoutConfig = false;
};

Main.prototype.checkConfig = function () {
	if (!config.getItem('host') || !config.getItem('port')) {
		return false;
	}
	return true;
};

Main.prototype.modules = {};

Main.prototype.registerModule = function (module) {
	this.modules[module.toLowerCase()] = new window[module]();
};

Main.prototype.isRegistered = function (module) {
    return typeof this.modules[module] != 'undefined';
};

Main.prototype.run = function () {
	var start = 'settings', i, me = this;
	start = config.getItem('start') || start;
    if (!this.initWithoutConfig) {
        this.initNoConfig();
    }
	if (this.checkConfig()) {
		for (i in this.modules) {
            this.initModule(i);
		}
		this.dispatch(start);
        this.pollLocation();
	} else {
		this.getConfig();
	}
};

Main.prototype.pollLocation = function () {
    var me = this;
    setInterval(function () {
        var hash = window.location.hash.replace('#', '');
        if (hash === '') {
            hash = start;
        }
        if (hash !== me.current && me.isRegistered(hash)) {
            me.dispatch(hash);
        } else if (hash === me.current && typeof me.destroy === 'function') {
            me.destroy();
            me.destroy = undefined;
        }
    }, 100);
};

Main.prototype.initModule = function (module) {
    if ("undefined" === typeof this.modules[module].initialized) {
        this.modules[module].name = module;
        this.modules[module].init();
        this.modules[module].initialized = true;
    }
};

Main.prototype.initNoConfig = function () {
    for (var i in this.modules) {
        if (typeof this.modules[i].noConfig !== 'undefined') {
            this.initModule(i);
        }
    }
    this.initWithoutConfig = true;
};

Main.prototype.dispatch = function (module, callback) {
    if (this.isRegistered('drawer')) this.modules.drawer.close();
	if (this.current != module) {
        if (this.current && typeof this.modules[this.current].destruct == 'function') {
            this.modules[this.current].destruct();
        }
		$('.content').hide();
		$('body').scrollTop();
        if (this.isRegistered('gui')) this.modules.gui.setCurrent(module);
        window.location.hash = '#'+module;
		this.modules[module].dispatch(callback);
		this.current = module;
	}
};

Main.prototype.getConfig = function () {
	this.modules['settings'].init();
	this.dispatch('settings', $.proxy(this.run, this));
};

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
