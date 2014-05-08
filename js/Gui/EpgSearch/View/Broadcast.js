/**
 * @class
 * @constructor
 */
Gui.EpgSearch.View.Broadcast = function () {};

/**
 * @type {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.EpgSearch.View.Broadcast.prototype = new Gui.Epg.View.Broadcasts.List.Broadcast();

/**
 * render dom
 */
Gui.EpgSearch.View.Broadcast.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    this.addChannel();
};

/**
 * override method as its not needed here
 * @returns {Gui.EpgSearch.View.Broadcast}
 */
Gui.EpgSearch.View.Broadcast.prototype.setWidth = function () {

    return this;
};

/**
 * override method as its not needed here
 * @returns {Gui.EpgSearch.View.Broadcast}
 */
Gui.EpgSearch.View.Broadcast.prototype.addChannel = function () {

    this.channel = $('<span class="channel">')
        .text(this.getChannelName())
        .appendTo(this.channelView);
};
