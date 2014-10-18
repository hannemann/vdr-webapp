/**
 * Channels resource
 * @constructor
 */
VDRest.Osd.Model.Osd = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Osd.Model.Osd.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Osd.Model.Osd.prototype._class = 'VDRest.Osd.Model.Osd';

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.Osd.Model.Osd.prototype.init = function () {

    this.currentOsd = null;
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.Osd.Model.Osd.prototype.loadOsd = function () {

    this.module.getResource('Osd').load({
        "url" : "main",
        "callback" : $.proxy(function (result) {
            this.currentOsd = result;
            $.event.trigger({
                "type" : "osdloaded",
                "payload" : {
                    "data" : this.currentOsd
                }
            });
        }, this)
    });
};

/**
 * retrieve osd
 */
VDRest.Osd.Model.Osd.prototype.getOsd = function () {

    return this.currentOsd;
};

