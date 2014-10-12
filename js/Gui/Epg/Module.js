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
 * start page capable
 * @type {string}
 */
Gui.Epg.prototype.startPage = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Epg.prototype.headline = 'EPG';

/**
 * context menu definition
 * @type {{}}
 */
Gui.Epg.prototype.contextMenu = {

    "Channelview" : {
        "labels" : {
            "off" : VDRest.app.translate("Channelview"),
            "on" : VDRest.app.translate("EPG View")
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
            "on" : VDRest.app.translate("Refresh")
        },
        "state" : "on",
        "scope" : 'Gui.Epg',
        "fn" : function () {

            this.refresh(VDRest.config.getItem('lastEpg'));
        }
    },

    "Primetime" : {
        "labels" : {
            "on" : VDRest.app.translate("Now"),
            "off" : VDRest.app.translate("Primetime")
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
            "on" : VDRest.app.translate("Set Time")
        },
        "state" : "on",
        "scope" : 'Gui.Epg',
        "fn" : function () {

            var data = {
                "type": "string",
                "dom": $('<label class="clearer text">'),
                "showInfo" : true
            };

            $('<span>').text(VDRest.app.translate('Custom Time')).appendTo(data.dom);
            $('<span class="info">')
                .html(VDRest.app.translate('Please enter desired date (optional) and/or time in format [[yyyy]mmdd] [h]hmm<br>(<strong>20141224 2015</strong> for <strong>2014.12.24 20:15</strong> o\'clock)'))
                .appendTo(data.dom);

            data.gui = $('<input type="text" name="custom-time">')
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
 * destroy view
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

    var custom,
        timeReg = new RegExp('([0-9]{1,2})([0-9]{2})'),
        value = e.target.value, values = value.split(' '),
        date, time,
        d = new Date();

    if (values.length > 1) {
        date = values[0];
        time = values[1];
    } else {
        time = value
    }

    if (date) {
        if (date.length === 4) {
            if (/([0-9]{2})([0-9]{2})/.test(date)) {
                date = new Date(
                    d.getFullYear(),
                    RegExp.$1 - 1,
                    RegExp.$2
                );
            }
        } else {
            if (/([0-9]{4})([0-9]{2})([0-9]{2})/.test(date)) {
                date = new Date(
                    RegExp.$1,
                    RegExp.$2 - 1,
                    RegExp.$3
                );
            }
        }
    } else {
        date = d;
    }

    if (timeReg.test(time)) {

        custom = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            RegExp.$1, RegExp.$2, 0
        );

        if (custom < d) {

            custom.setTime(custom.getTime() + 24 * 60 * 60 * 1000);
        }

        this.refresh('custom', custom);
    }

};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Epg', true);