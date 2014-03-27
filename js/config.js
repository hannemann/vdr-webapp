Config = function () {
	var storage = null;
	try {
		if ('localStorage' in window && window['localStorage'] !== null) {
			storage = localStorage;
		}
	} catch (e) {
		alert('Kein LocalStorage. Kauf einen neuen Browser!');
		return false;
	};

	this.setItem = function (k, v) {
		storage.setItem(k, v);
		return this;
	};

	this.getItem = function (k) {
		var value = storage.getItem(k);
		if (!value && typeof this.defaults[k] !== 'undefined') {
			value = this.defaults[k];
		}
		return value;
	};

	this.removeItem = function (k) {
		storage.removeItem(k);
		return this;
	};

	this.clear = function () {
		storage.clear();
		return this;
	};
};

Config.prototype.storage = null;

Config.prototype.defaults = {
	"lastEpg":"now",
	"start":"epg",
    "debug":true,
    "recordingStartGap":120,
    "recordingEndGap":600
};

config = new Config();
