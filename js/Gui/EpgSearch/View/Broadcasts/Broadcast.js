/**
 * @class
 * @constructor
 */
Gui.EpgSearch.View.Broadcasts.Broadcast = function () {};

/**
 * @type {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype = new Gui.Epg.View.Broadcasts.List.Broadcast();

/**
 * render dom
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    this.addImage();
    this.addChannel();
};

/**
 * override method as its not needed here
 * @returns {Gui.EpgSearch.View.Broadcast}
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype.setWidth = function () {

    return this;
};

/**
 * @returns {number}
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype.getWidth = function () {

    return window.innerWidth;
};

/**
 * override method as its not needed here
 * @returns {Gui.EpgSearch.View.Broadcast}
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype.addChannel = function () {

    if (!this.channel) {
        this.channel = $('<span class="channel">')
            .text(this.getChannelName())
            .appendTo(this.channelView);
    }
};
