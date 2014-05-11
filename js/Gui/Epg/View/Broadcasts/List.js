/**
 * @class
 * @constructor
 */
Gui.Epg.View.Broadcasts.List = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Epg.View.Broadcasts.List.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.Epg.View.Broadcasts.List.prototype.cacheKey = 'channel_id';

/**
 * @var {jQuery} node
 */
Gui.Epg.View.Broadcasts.List.prototype.init = function () {

    this.node = $('<div class="broadcasts-list">');
};

/**
 * set list visibility
 */
Gui.Epg.View.Broadcasts.List.prototype.setIsVisible = function (visible) {

        this.node.toggleClass('invisible', !visible);
};