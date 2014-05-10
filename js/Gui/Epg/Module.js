/**
 * Epg Module
 * @constructor
 */
Gui.Epg = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Epg.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Epg.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.Epg.prototype.name = 'Epg';

/**
 * show up in drawer
 * @type {string}
 */
Gui.Epg.prototype.inDrawer = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Epg.prototype.headline = 'EPG';

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Epg.prototype.contextMenu = {

    "Channelview" : {
        "labels" : {
            "off" : "Channelview",
            "on" : "EPG View"
        },
        "state" : "off",
        "scope" : 'Gui.Epg',
        "fn" : function () {

            if ("off" === this.contextMenu.Channelview.state) {

                this.contextMenu.Channelview.state = "on";
                $.event.trigger({
                    "type" : "epg.channelview",
                    "payload" : this.getController('Channels').channelsList[0]
                });

            } else {

                this.contextMenu.Channelview.state = "off";
                $.event.trigger({
                    "type" : "epg.channelview",
                    "payload" : false
                });
            }
        }
    },

    "Refresh" : {
        "labels" : {
            "on" : "Refresh"
        },
        "state" : "on",
        "scope" : 'Gui.Epg',
        "fn" : function () {

            this.refresh(VDRest.config.getItem('lastEpg'));
        }
    },

    "Primetime" : {
        "labels" : {
            "on" : "Now",
            "off" : "Primetime"
        },
        "state" : VDRest.config.getItem('lastEpg') === 'now' ? "off" : "on",
        "scope" : 'Gui.Epg',
        "fn" : function () {

            if ("off" === this.contextMenu.Primetime.state) {

                this.contextMenu.Primetime.state = 'on';
                this.refresh('prime')

            } else {

                this.contextMenu.Primetime.state = 'off';
                this.refresh('now')

            }
        }
    },

    "CustomTime" : {
        "labels" : {
            "on" : "Set Time"
        },
        "state" : "on",
        "scope" : 'Gui.Epg',
        "fn" : function () {

            var data = {
                "type": "number",
                "dom": $('<label class="clearer text">')
            };

            $('<span>').text(VDRest.app.translate('Custom Time')).appendTo(data.dom);
            $('<span class="info">')
                .text(VDRest.app.translate('Please enter desired time in format [h]hmm (2015 for 20:15 o\'clock)'))
                .appendTo(data.dom);

            data.gui = $('<input type="number" name="custom-time">')
                .appendTo(data.dom);

            data.gui.on('change', $.proxy(this.setCustomTime, this));

            $.event.trigger({
                "type" : "window.request",
                "payload" : {
                    "type" : "Input",
                    "data" : data
                }
            });
        }
    }
};

/**
 * dispatch default view
 */
Gui.Epg.prototype.dispatch = function () {

    this.store = VDRest.app.getModule('VDRest.Epg');
    this.getController('Epg').dispatchView();
};

/**
 * dispatch default view
 */
Gui.Epg.prototype.destruct = function () {

    this.getController('Epg').destructView(true);
};

/**
 * refresh default view
 * @param {string} time date object to be used (now|prime|custom)
 * @param {Date} [custom] custom Date object
 */
Gui.Epg.prototype.refresh = function (time, custom) {

    var me = this;
    setTimeout(function () {
        me.getController('Epg').destructView();
        me.cache.flush();
        VDRest.app.getModule('VDRest.Epg').initTimes(custom).cache.flush();
        VDRest.config.setItem('lastEpg', time);
        me.dispatch();
    }, 150);
};

/**
 * retrieve date object of chosen EPG start time
 * @returns {*}
 */
Gui.Epg.prototype.getFromDate = function () {

    return this.store[VDRest.config.getItem('lastEpg')];
};

/**
 * calc custom time, call refresh
 */
Gui.Epg.prototype.setCustomTime = function (e) {

    var now, custom, reg = new RegExp('([0-9]{1,2})([0-9]{1,2})'), value = e.target.value;

    if (value.length === 3) {

        reg = new RegExp('([0-9]{1})([0-9]{1,2})');
    }

    if (reg.test(value)) {

        now = new Date();

        custom = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            RegExp.$1, RegExp.$2, 0
        );

        if (custom < now) {

            custom.setTime(custom.getTime() + 24 * 60 * 60 * 1000);
        }

        this.refresh('custom', custom);
    }

};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Epg', true);