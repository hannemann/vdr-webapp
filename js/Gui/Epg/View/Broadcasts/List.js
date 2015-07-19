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
Gui.Epg.View.Broadcasts.List.prototype.render = function () {

    var height, top;
    VDRest.Abstract.View.prototype.render.apply(this);

    height = this.node[0].offsetHeight;
    top = this.data.listIndex * height;

    this.onScreen = Math.floor(top/this.data.broadcastsHeight);

    this.node[0].classList.add('visible-screen-' + this.onScreen.toString());
};

/**
 * set list visibility
 */
Gui.Epg.View.Broadcasts.List.prototype.setIsVisible = function (visible) {

    //this.node.toggleClass('invisible', !visible);
};