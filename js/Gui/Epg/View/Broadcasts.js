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
    this.node = $('<div id="broadcasts" class="touchmove-slide">')
        .appendTo(this.wrapper);
    this.timeIndicator = $('<div id="epg-time-indicator">')
        .appendTo(this.node);
};

/**
 * append node to parentNode
 */
Gui.Epg.View.Broadcasts.prototype.render = function () {

    this.wrapper.appendTo(this.parentView.node);
    this.updateIndicator();


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

Gui.Epg.View.Broadcasts.prototype.updateIndicator = function () {

    var timeDiff = Date.now() - this.module.getFromDate().getTime(),
        width;

    if (timeDiff > 0) {
        this.timeIndicator.show();
        width = Math.round(timeDiff / 1000 * VDRest.config.getItem('pixelPerSecond')) - 1;
    } else {
        this.timeIndicator.hide();
    }


    this.timeIndicator.width(width);
};
