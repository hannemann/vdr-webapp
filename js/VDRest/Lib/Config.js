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

		var value = storage.getItem(k), type;

		if (!value && typeof this.defaults[k] !== 'undefined') {
			value = this.defaults[k];
		}

        if (this.fields[k]) {

            type = this.fields[k].dataType || this.fields[k].type;

            if ("number" === type) {

                value = parseFloat(value);
            }

            if ("boolean" === type) {

                value = value === "true";
            }
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
    "debug"             :   false,
    "port"              :   "8002",
    "recordingStartGap" :   120,
    "recordingEndGap"   :   6000,
    "protocol"          :   "http",
    "pixelPerSecond"    :   2/60,
    "streamdevPort"     :   "3000",
    "streamdevParams"   :   "EXT;QUALITY=SLOW",
    "theme"             :   "default",
    "autoVps"           :   false
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
        "info" : "Needs reload of app",
        "type" : "enum",
        "dataType" : "string",
        "label" : "Startpage",
        /**
         * @returns {{}}
         */
        "values" : function () {

            var i, modules = VDRest.app.modules,
                pages = {}, start = VDRest.config.getItem('start');

            for (i in modules) {

                if (
                    modules.hasOwnProperty(i)
                    && "Gui" === modules[i].namespace
                    && "undefined" !== typeof modules[i].inDrawer
                ) {
                    pages[i] = {
                        "label" : modules[i].headline,
                        "value" : i,
                        "selected" : start === i
                    }

                }
            }

            if ("true" === VDRest.config.getItem('debug')) {

                pages['Gui.Config'] = {
                    "label" : "Configuration",
                    "value" : "Gui.Config",
                    "selected" : start === "Gui.Config"
                };
            }

            return pages;
        }
    },
    "theme"          :   {
        "category" : "gui",
        "type" : "enum",
        "label" : "Theme",
        "info" : "Needs reload of app",
        "dataType" : "string",
        "values" : {
            "default" : {
                "label" : "Default",
                "value" : "default"
            },
            "black" : {
                "label" : "Black",
                "value" : "black"
            }
        }
    },
    "protocol"          :   {
        "category" : "server",
        "type" : "enum",
        "label" : "Prototcol",
        "dataType" : "string",
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
        "info" : "Lead time of recording before broadcast starts (seconds)"
    },
    "recordingEndGap"   :   {
        "category" : "timer",
        "type" : "number",
        "label" : "Recording follow up time",
        "info" : "Follow up time of recording after broadcast ends (seconds)"
    },
    "autoVps"   :   {
        "category" : "timer",
        "type" : "boolean",
        "label" : "Use VPS if available"
    },
    "streamdevActive"    :   {
        "category" : "streaming",
        "type" : "boolean",
        "label" : "Use StreamDev"
    },
    "streamdevHost"    :   {
        "depends" : "streamdevActive",
        "category" : "streaming",
        "type" : "string",
        "label" : "StreamDev host"
    },
    "streamdevPort"    :   {
        "depends" : "streamdevActive",
        "category" : "streaming",
        "type" : "number",
        "label" : "StreamDev port"
    },
    "streamdevParams"  :   {
        "depends" : "streamdevActive",
        "category" : "streaming",
        "type" : "string",
        "label" : "StreamDev parameter"
    },
    "debug"             :   {
        "category" : "dev",
        "type" : "boolean",
        "label" : "Debugmode"
    }
};

VDRest.config = new VDRest.Lib.Config();
