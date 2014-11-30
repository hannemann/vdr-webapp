/**
 * @class
 * @constructor
 */
Gui.Epg.View.Broadcasts = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Epg.View.Broadcasts.prototype = new VDRest.Abstract.View();

/**
 * Main EPG View
 * @var {jQuery} wrapper
 * @var {jQuery} node
 */
Gui.Epg.View.Broadcasts.prototype.init = function () {

    this.wrapper = $('<div id="broadcasts-wrapper">');
    this.node = $('<div id="broadcasts" class="slide">')
        .appendTo(this.wrapper);
};

/**
 * append node to parentNode
 */
Gui.Epg.View.Broadcasts.prototype.render = function () {

    this.wrapper.appendTo(this.parentView.node);
};

/**
 * retrieve available timespan for events according to chosen type
 * depends on pixel per seconds value
 *
 * @param type
 * @returns {number}
 */
Gui.Epg.View.Broadcasts.prototype.getAvailableTimespan = function (type) {

    var pps = VDRest.config.getItem('pixelPerSecond');

    switch (type) {
        case "seconds":
            return this.wrapper.innerWidth() / (pps);
        case "minutes":
            return this.wrapper.innerWidth() / (pps * 60);
        case "hours":
        default:
            return this.wrapper.innerWidth() / (pps * 60 * 60);
    }

};
