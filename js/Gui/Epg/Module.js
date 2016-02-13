/**
 * Epg Module
 * @constructor
 * @property {VDRest.Lib.Cache} cache
 * @property {VDRest.Epg} store
 * @property {function} Model
 * @property {function} View
 * @property {function} ViewModel
 * @property {function} Controller
 * @property {function} Helper
 * @property {function} Controller.Window
 * @property {function} View.Window
 * @property {function} ViewModel.Window
 * @property {function} Helper.Window
 * @property {VDRest.Lib.Cache} cache
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
 * headline in menu bar
 * @type {string}
 */
Gui.Epg.prototype.filterButtonSymbol = '';

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

                VDRest.app.pushHistoryState(
                    'epg-channelview',
                    this.toggleChannelView.bind(this)
                );
                this.toggleChannelView(this.getController('Channels').channelsList[0]);

            } else {

                history.back();
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

    "ChannelGroup" : {
        "labels" : {
            "on" : VDRest.app.translate("Channelgroup")
        },
        "state" : "on",
        "scope" : 'Gui.Epg',
        "hidden" : false,
        "fn" : function () {
            this.getController('Epg').selectGroup();
        }
    },

    "CustomTime" : {
        "labels" : {
            "on" : VDRest.app.translate("Set Time")
        },
        "state" : "on",
        "scope" : 'Gui.Epg',
        "fn" : function () {

            var data, d = new Date(), v;

            v = d.getFullYear().toString() +
            VDRest.helper.pad((d.getMonth() + 1).toString(), 2) +
            VDRest.helper.pad(d.getDate().toString(), 2) +
            VDRest.helper.pad(d.getHours().toString(), 2) +
            VDRest.helper.pad(d.getMinutes().toString(), 2);

            data = {
                "type": "datetime",
                "dom": $('<label class="clearer text">'),
                "showInfo": true,
                "format": "%Y.%m.%d %H:%i",
                "form_order": "YmdHi",
                "value": v
            };

            $('<span>').text(VDRest.app.translate('Custom Time')).appendTo(data.dom);
            $('<span class="info">')
                .html(VDRest.app.translate('YYYY.mm.dd hh:mm'))
                .appendTo(data.dom);

            data.gui = $('<input type="text" name="custom-time">')
                .appendTo(data.dom);
            data.gui.val(data.value);

            data.gui.on('change', this.setCustomTime.bind(this));

            $.event.trigger({
                "type" : "window.request",
                "payload" : {
                    "module" : VDRest.app.getModule('Gui.Form'),
                    "type": "Window.DateTime",
                    "data" : data
                }
            });
            this.contextMenu.Primetime.state = 'on';
        }
    }
};

/**
 * dispatch default view
 */
Gui.Epg.prototype.dispatch = function () {

    this.store = VDRest.app.getModule('VDRest.Epg');
    this.getController('Epg').dispatchView();
    if ("undefined" === typeof this.filterButton) {
        this.addFilterButton();
    }
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

    setTimeout(function () {
        this.getController('Epg').destructView();
        this.cache.flush();
        VDRest.app.getModule('VDRest.Epg').initTimes(custom).cache.flush();
        VDRest.config.setItem('lastEpg', time);
        this.dispatch();
    }.bind(this), 150);
};

/**
 * retrieve date object of chosen EPG start time
 * @returns {Date}
 */
Gui.Epg.prototype.getFromDate = function () {

    return this.store[VDRest.config.getItem('lastEpg')];
};

/**
 * calc custom time, call refresh
 */
Gui.Epg.prototype.setCustomTime = function (e) {

    var custom,
        timeReg = new RegExp('([0-9]{1,2}):([0-9]{2})'),
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
            if (/([0-9]{2}).([0-9]{2})/.test(date)) {
                date = new Date(
                    d.getFullYear(),
                    RegExp.$1 - 1,
                    RegExp.$2
                );
            }
        } else {
            if (/([0-9]{4}).([0-9]{2}).([0-9]{2})/.test(date)) {
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
 * unset muted flag
 */
Gui.Epg.prototype.unMute = function () {

    VDRest.Abstract.Module.prototype.unMute.call(this);
    this.getController('Epg').recover();
    this.addFilterButton();
};

/**
 * unset muted flag
 */
Gui.Epg.prototype.mute = function () {

    VDRest.Abstract.Module.prototype.mute.call(this);
    this.removeFilterButton();
};

/**
 * add filter button
 */
Gui.Epg.prototype.addFilterButton = function () {

    this.filterButton = this.getMenubar().addButton(
        this.filterButtonSymbol,
        function () {
            this.getController('Epg').selectGroup();
        }.bind(this)
    );
};

/**
 * remove filter button
 */
Gui.Epg.prototype.removeFilterButton = function () {

    this.getMenubar().removeButton(this.filterButton);
};

/**
 * retrieve menu bar controller
 * @return {Gui.Menubar.Controller.Default}
 */
Gui.Epg.prototype.getMenubar = function () {

    return VDRest.app.getModule('Gui.Menubar').getController('Default');
};

/**
 * toggle channel view
 * @param {Gui.Epg.Controller.Channels.Channel} [channel]
 */
Gui.Epg.prototype.toggleChannelView = function (channel) {

    if (
        channel instanceof Gui.Epg.Controller.Channels.Channel && !this.getController('Epg').getIsChannelView()
    ) {

        this.contextMenu.Channelview.state = "on";
        this.contextMenu.ChannelGroup.hidden = true;
        $.event.trigger({
            "type": "epg.channelview",
            "payload": channel
        });
        this.removeFilterButton();
    } else {

        this.contextMenu.Channelview.state = "off";
        this.contextMenu.ChannelGroup.hidden = false;
        $.event.trigger({
            "type": "epg.channelview",
            "payload": false
        });
        this.addFilterButton();
    }
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Epg', true);