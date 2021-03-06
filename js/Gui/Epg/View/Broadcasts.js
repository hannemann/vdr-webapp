/**
 * @class
 * @constructor
 * @property {jQuery} node
 * @property {jQuery} wrapper
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
    this.left = this.wrapper[0].offsetLeft;
    this.updateIndicator();
};

/**
 * update time indicator
 */
Gui.Epg.View.Broadcasts.prototype.updateIndicator = function () {

    var timeDiff = Date.now() - this.module.getFromDate().getTime(),
        width;

    if (timeDiff > 0) {
        this.timeIndicator.addClass('show');
        width = Math.round(timeDiff / 1000 * VDRest.config.getItem('pixelPerSecond')) - 1;
    } else {
        this.timeIndicator.removeClass('show');
    }

    this.timeIndicator.width(width);
};

/**
 * set wrapper height
 * @param height
 * @returns {Gui.Epg.View.Broadcasts}
 */
Gui.Epg.View.Broadcasts.prototype.setWrapperHeight = function (height) {

    this.wrapper.height(height);
    return this;
};

/**
 * unset wrapper height
 * @returns {Gui.Epg.View.Broadcasts}
 */
Gui.Epg.View.Broadcasts.prototype.unsetWrapperHeight = function () {

    this.wrapper[0].style.height = '';
    return this;
};
