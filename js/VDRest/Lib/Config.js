/**
 * read from and write to localStorage
 * @constructor
 */
VDRest.Lib.Config = function () {};

VDRest.Lib.Config.prototype.availableLanguages = {
    "de" : "de_DE"
};

/**
 * read from and write to localStorage
 * @constructor
 */
VDRest.Lib.Config.prototype.init = function () {

	var storage = null, h = document.querySelector('html'), deviceMetrics = {
        "width" : h.offsetWidth,
        "height" : h.offsetHeight
    };

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

        if (this.fields[k]) {

            this.setFieldValue(k, v);
        }

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

            if ("function" === typeof this.defaults[k]) {
                value = this.defaults[k]();
            } else {
                value = this.defaults[k];
            }
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

    if (deviceMetrics.width >= 800 || deviceMetrics.height >= 800) {

        VDRest.Lib.Config.prototype.defaults.pixelPerSecond = 3.7333/60;
    } else if (deviceMetrics.width >= 1100 || deviceMetrics.height >= 1100) {

        VDRest.Lib.Config.prototype.defaults.pixelPerSecond = 6/60;
    }

    if (!this.getItem('recordingsSyncId')) {
        this.setItem('recordingsSyncId', Date.now().toString());
    }

    this.initFieldValues();

    return this;
};

/**
 * add values to fields
 */
VDRest.Lib.Config.prototype.initFieldValues = function () {

    var i, type;

    for (i in this.fields) {

        if (this.fields.hasOwnProperty(i)) {

            type = this.fields[i].type;

            if ('string' === type || 'number' === type) {

                this.fields[i].value = this.getItem(i);
            }

            if ('boolean' === type) {

                this.fields[i].checked = this.getItem(i)
            }

            if ('enum' === type) {

                if ('function' !== typeof this.fields[i].values) {

                    this.fields[i].values[this.getItem(i)].selected = true;
                }
            }
        }
    }
};

/**
 * @param {string} k
 * @param v
 */
VDRest.Lib.Config.prototype.setFieldValue = function (k, v) {

    var type = this.fields[k].type;

    if ('string' === type || 'number' === type) {

        this.fields[k].value = v;
    }

    if ('boolean' === type) {

        this.fields[k].checked = v
    }

    if ('enum' === type) {

        if ('function' !== typeof this.fields[k].values) {

            this.fields[k].values[v].selected = true;
        }
    }
};
/**
 * Default values (as string or number)
 * @type {Object}
 */
VDRest.Lib.Config.prototype.defaults = {
    "lastEpg"               :   "now",
    "debug"                 :   "false",
    "port"                  :   "8002",
    "recordingStartMargin"  :   "120",
    "recordingEndMargin"    :   "600",
    "protocol"              :   function() {
        return location.protocol.replace(/[^htps]/, '');
    },
    "pixelPerSecond"        :   2/60,
    "streamdevProtocol"     :   function() {
        return location.protocol.replace(/[^htps]/, '');
    },
    "streamdevHost"         :   "",
    "streamdevPort"         :   "3000",
    "streamdevParams"       :   "EXT",
    "streamdevContainer"    :   "mkv",
    "streamDownload"        :   "false",
    "streamAudioGain"       :   100,
    "useContentLengthWorkaround" : false,
    "useGPUEncoder"         :   false,
    "transcoderPath"        :   '',
    "theme"                 :   "default",
    "autoVps"               :   "false",
    "language"              :   function () {
        var lang = navigator.language.split('_')[0];
        return VDRest.Lib.Config.prototype.availableLanguages[lang] || "en_US";
    },
    "showRadio"             :   "false",
    "channelLimit"          :   "100",
    "startChannel"          :   "1",
    "useSlowServerStrategy" : "false",
    "loadAllChannelsInitially": "false",
    "useHtmlPlayer"         :   "false",
    "defaultSorting"        :   "dateDesc",
    "videoQualitySize"      :   "320x180",
    "videoQualityBitrate"   :   "512K",
    "videoMinimizedLandscape" : "left",
    "hapticFeedback"        :   "true",
    "favourites"            :   "",
    "osdDelay"              :   100,
    "osdLoadInterval"       :   2000,
    "showImageInEpgView"    : "true",
    "firstTime"             : "true",
    "indicateChannelHD"     : "false",
    "recordingsSyncInterval": 1800000,
    "supportChromecast"     : "false"
};

VDRest.Lib.Config.prototype.categories = {
    "dev" : {
        "label" : 'Developer Options'
    },
    "server" : {
        "label" : 'Server Settings'
    },
    "osd" : {
        "label" : 'OSD Settings'
    },
    "channels" : {
        "label" : 'Channel Settings'
    },
    "timer" : {
        "label" : 'Timer Settings'
    },
    "recordings" : {
        "label" : 'Recordings Settings'
    },
    "streaming" : {
        "label" : 'Streaming'
    },
    "gui" : {
        "label" : 'User Interface'
    },
    "misc": {
        "label": 'Misc.'
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
                    && "undefined" !== typeof modules[i].startPage
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
    },/*
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
    },*/
    "hapticFeedback" :   {
        "category" : "gui",
        "type" : "boolean",
        "label" : "Vibration"
    },
    "showImageInEpgView" :   {
        "category" : "gui",
        "type" : "boolean",
        "label" : "Show images in EPG view"
    },
    "indicateChannelHD": {
        "category": "gui",
        "type": "boolean",
        "label": "Indicate HD Channels"
    },
    "language" : {
        "category" : "gui",
        "type" : "enum",
        "label" : "Language",
        "dataType" : "string",
        "info" : "Needs reload of app",
        "values" : {
            "de_DE" : {
                "label" : "Deutsch (Deutschland)",
                "value" : "de_DE"
            },
            "en_US" : {
                "label" : "English (United States)",
                "value" : "en_US"
            }
        }
    },
    "protocol"          :   {
        "category" : "server",
        "type" : "enum",
        "label" : "Prototcol",
        "dataType" : "string",
        "info" : "Needs reload of app",
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
        "label" : "Host",
        "info" : "Needs reload of app"
    },
    "port"              :   {
        "category" : "server",
        "type" : "number",
        "label" : "Port",
        "info" : "Needs reload of app"
    },
    "loadAllChannelsInitially": {
        "category" : "server",
        "type" : "boolean",
        "label": "Load events for all channels on startup"
    },
    "useSlowServerStrategy": {
        "category": "server",
        "type": "boolean",
        "label": "Load synced (deprecated)",
        "info": "Loads data synchronized to not burn slow CPU\'s"
    },
    "osdDelay"              :   {
        "category" : "osd",
        "type" : "number",
        "label" : "OSD Delay (ms)",
        "info" : "Time to wait after key press before OSD is refreshed"
    },
    "osdLoadInterval"       :   {
        "category" : "osd",
        "type" : "number",
        "label" : "OSD refresh interval (ms)"
    },
    "showRadio" :   {
        "category" : "channels",
        "type" : "boolean",
        "label" : "Show radio channels"
    },
    "startChannel"              :   {
        "category" : "channels",
        "type" : "number",
        "label" : "First channel",
        "info" : "Number of first channel to be loaded (starts with 1)"
    },
    "channelLimit"              :   {
        "category" : "channels",
        "type" : "number",
        "label" : "Max. Channels",
        "info" : "Max. number of channels to be displayed in EPG (0 = no limit)"
    },
    "recordingStartMargin" :   {
        "category" : "timer",
        "type" : "number",
        "label" : "Recording lead time",
        "info" : "Lead time of recording before broadcast starts (seconds)"
    },
    "recordingEndMargin"   :   {
        "category" : "timer",
        "type" : "number",
        "label" : "Recording follow up time",
        "info" : "Follow up time of recording after broadcast ends (seconds)"
    },
    "autoVps"   :   {
        "category" : "timer",
        "type" : "boolean",
        "label": "Use VPS if available",
        "info": "not recommended if epg grabbers are in use"
    },
    "recordingsSyncInterval"   :   {
        "category" : "recordings",
        "type" : "enum",
        "label": "Sync Interval",
        "dataType" : "number",
        "values" : {
            "300000" : {
                "label" : "5 Minutes",
                "value" : 300000
            },
            "900000" : {
                "label" : "15 Minutes",
                "value" : 900000
            },
            "1800000" : {
                "label" : "30 Minutes",
                "value" : 1800000
            },
            "3600000" : {
                "label" : "1 Hour",
                "value" : 3600000
            },
            "7200000" : {
                "label" : "2 Hours",
                "value" : 7200000
            },
            "14400000" : {
                "label" : "4 Hours",
                "value" : 14400000
            },
            "28800000" : {
                "label" : "8 Hours",
                "value" : 28800000
            }/*,
            "5000" : {
                "label" : "debug",
                "value" : 5000
            }*/
        }
    },
    "streamdevActive"    :   {
        "category" : "streaming",
        "type" : "boolean",
        "label" : "Use StreamDev"
    },
    "streamdevProtocol"    :   {
        "depends" : "streamdevActive",
        "category" : "streaming",
        "type" : "enum",
        "label" : "Stream protocol",
        "dataType" : "string",
        "info" : "e.g.: Force usage of VLC",
        "values" : {
            "http" : {
                "label" : "HTTP",
                "value" : "http"
            },
            "https" : {
                "label" : "HTTPS",
                "value" : "https"
            },
            "vlc" : {
                "label" : "VLC",
                "value" : "vlc"
            }
        }
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
    "streamdevContainer"  :   {
        "depends" : "streamdevActive",
        "category" : "streaming",
        "type" : "enum",
        "label" : "Container",
        "dataType" : "string",
        "values" : {
            "mkv" : {
                "label" : "Matroska",
                "value" : "mkv"
            },
            "webm" : {
                "label" : "WebM",
                "value" : "webm"
            }
        }
    },
    "streamAudioGain"  :   {
        "depends" : "streamdevActive",
        "category" : "streaming",
        "type" : "number",
        "label" : "Adjust volume",
        "info" : "adjust volume to x percent"
    },
    "favourites" : {
        "depends" : "streamdevActive",
        "category" : "streaming",
        "type" : "channel",
        "multiselect" : true,
        "label" : "Favourites",
        "selected": function () {

            try {
                return JSON.parse(VDRest.config.getItem('favourites'));
            } catch (e) {
                return [];
            }

        }
    },
    "useHtmlPlayer"    :   {
        "depends" : "streamdevActive",
        "category" : "streaming",
        "type" : "boolean",
        "label" : "Use HTML5 Video Player",
        "info" : "An extended externremux.sh is needed"
    },
    "videoMinimizedLandscape" : {
        "category" : "streaming",
        "depends" : {
            "streamdevActive": true,
            "useHtmlPlayer": true
        },
        "type" : "enum",
        "dataType" : "string",
        "label" : "Minimized Position (Landscape)",
        "values" : {
            "left" : {
                "label" : "Left",
                "value" : "left"
            },
            "right" : {
                "label" : "Right",
                "value" : "right"
            }
        }
    },
    "supportChromecast":   {
        "depends" : {
            "streamdevActive": true,
            "useHtmlPlayer": true
        },
        "category" : "streaming",
        "type" : "boolean",
        "label" : "Support Chromecast",
        "info" : "Shows the Chromecast button when controls hide. Does not work with self-signed certificates."
    },
    "streamDownload" : {
        "depends" : {
            "streamdevActive": true,
            "useHtmlPlayer": true
        },
        "category" : "streaming",
        "type" : "boolean",
        "label" : "Download",
        "info": "Enable download of transcoded Recordings. Does work on Android powered devices if you delegate the download to Firefox for Android. Downloads will be transcoded using libx264 with current quality settings and aac. Container is Matroska."
    },
    "useContentLengthWorkaround" : {
        "depends" : {
            "streamdevActive": true,
            "useHtmlPlayer": true
        },
        "category" : "streaming",
        "type" : "boolean",
        "label" : "Use Content-Length Workaround",
        "info": "Enable on mobile Chrome only. Chrome sends several requests to streamdev hence the server transcodes multiple streams. With this option enabled externremux tries to detect if a HTTP_ALLOW_CROSS_DOMAIN_REDIRECT header is set to 'false'. If condition is met it sets a two bytes content length header forcing the browser to abort unnecessary requests. Tested with Chrome 49 Android Marshmallow"
    },
    "useGPUEncoder" : {
        "depends" : {
            "streamdevActive": true
        },
        "category" : "streaming",
        "type" : "boolean",
        "label" : "Use GPU for transcoding",
        "info": "Works with Kepler GPU's. You have to compile ffmpeg mith option --enable-nvenc to make this work"
    },
    "transcoderPath"    :   {
        "depends" : {
            "streamdevActive": true
        },
        "category" : "streaming",
        "type" : "string",
        "label" : "Path to transcoder",
        "info" : "(Full path e.g. /home/vdruser/bin/ffmpeg)"
    },
    "firstTime": {
        "category": "misc",
        "type": "info",
        "window": "FirstTime",
        "label": "Show first time installation guide"
    },
    "debug"             :   {
        "category" : "dev",
        "type" : "boolean",
        "label" : "Debugmode"
    }
};

VDRest.config = new VDRest.Lib.Config();

VDRest.config.init();
