/**
 * read from and write to localStorage
 * @constructor
 */
VDRest.Config = function () {

	var storage = null;

	try {

		if ('localStorage' in window && window['localStorage'] !== null) {

			storage = localStorage;
		}

	} catch (e) {

		throw 'No localStorage available.';
	}

    /**
     * persist item in storage
     * @param {String} k
     * @param {String} v
     * @return {*}
     */
	this.setItem = function (k, v) {

		storage.setItem(k, v);
		return this;
	};

    /**
     * retrieve item from storage
     * if not found lookup defaults
     * @param k
     * @return {*}
     */
	this.getItem = function (k) {

		var value = storage.getItem(k);
		if (!value && typeof this.defaults[k] !== 'undefined') {
			value = this.defaults[k];
		}
		return value;
	};

    /**
     * remove item from storage
     * @param k
     * @return {*}
     */
	this.removeItem = function (k) {

		storage.removeItem(k);
		return this;
	};

    /**
     * clear whole storage
     * @return {*}
     */
	this.clear = function () {

		storage.clear();
		return this;
	};
};

/**
 * Default values
 * @type {Object}
 */
VDRest.Config.prototype.defaults = {
	"lastEpg"           :   "now",
	"start"             :   "epgold",
    "debug"             :   false,
    "port"              :   "8002",
    "streamdev-port"    :   "3000",
    "recordingStartGap" :   120,
    "recordingEndGap"   :   6000,
    "protocol"          :   "http",
    "host"              :   "192.168.3.99",
    "pixelPerSecond"    :   2/60,
    "streamdev-params"  :   "EXT;QUALITY=SLOW"
};

VDRest.config = new VDRest.Config();
