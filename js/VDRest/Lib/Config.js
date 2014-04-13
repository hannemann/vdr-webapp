/**
* read from and write to localStorage
* @constructor
*/
VDRest.Lib.Config = function () {

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
VDRest.Lib.Config.prototype.defaults = {
    "lastEpg"           :   "now",
    "start"             :   "epgold",
    "debug"             :   false,
    "port"              :   "8002",
    "recordingStartGap" :   120,
    "recordingEndGap"   :   6000,
    "protocol"          :   "http",
    "host"              :   "192.168.3.99",
    "pixelPerSecond"    :   2/60,
    "streamdevHost"     :   "192.168.3.99",
    "streamdevPort"     :   "3000",
    "streamdevParams"   :   "EXT;QUALITY=SLOW"
};

VDRest.Lib.Config.prototype.categories = {
    "dev" : {
        "label" : 'Developer Options'
    },
    "server" : {
        "label" : 'Server Settings'
    },
    "timer" : {
        "label" : 'Timer Settings'
    },
    "streaming" : {
        "label" : 'Streaming'
    },
    "gui" : {
        "label" : 'User Interface'
    }
};

/**
 * Default values
 * @type {Object}
 */
VDRest.Lib.Config.prototype.fields = {
    "start"             :   {
        "category" : "gui",
        "type" : "enum",
        "label" : "Startpage",
        "values" : function () {

            // TODO: read from app
            return {
                "epg" : {
                    "label" : "EPG",
                    "value" : "Gui.Epg"
                },
                "settings" : {
                    "label" : "Settings",
                    "value" : "settings"
                }
            }
        }
    },
    "debug"             :   {
        "category" : "dev",
        "type" : "boolean",
        "label" : "Debugmode"
    },
    "protocol"          :   {
        "category" : "server",
        "type" : "enum",
        "label" : "Prototcol",
        "values" : {
            "http" : {
                "label" : "HTTP",
                "value" : "http"
            },
            "https" : {
                "label" : "HTTPS",
                "value" : "https"
            }
        }
    },
    "host"              :   {
        "category" : "server",
        "type" : "string",
        "label" : "Host"
    },
    "port"              :   {
        "category" : "server",
        "type" : "number",
        "label" : "Port"
    },
    "recordingStartGap" :   {
        "category" : "timer",
        "type" : "number",
        "label" : "Recording lead time",
        "info" : "Lead time of recording before broadcast starts"
    },
    "recordingEndGap"   :   {
        "category" : "timer",
        "type" : "number",
        "label" : "Recording follow up time",
        "info" : "Follow up time of recording after broadcast ends"
    },
    "streamdevHost"    :   {
        "category" : "streaming",
        "type" : "string",
        "label" : "StreamDev host"
    },
    "streamdevPort"    :   {
        "category" : "streaming",
        "type" : "number",
        "label" : "StreamDev port"
    },
    "streamdevParams"  :   {
        "category" : "streaming",
        "type" : "string",
        "label" : "StreamDev parameter"
    }
};

VDRest.config = new VDRest.Lib.Config();
