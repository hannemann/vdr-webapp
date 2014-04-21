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

            this.refresh();
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
 */
Gui.Epg.prototype.refresh = function () {

    this.getController('Epg').destructView();
    this.cache.flush();
    this.dispatch();
};

/**
 * retrieve date object of chosen EPG start time
 * @returns {*}
 */
Gui.Epg.prototype.getFromDate = function () {

    return this.store[VDRest.config.getItem('lastEpg')];
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Epg', true);