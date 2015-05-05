/**
 * @class
 * @constructor
 */
Gui.SearchTimer.View.Broadcast = function () {
};

/**
 * @type {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.SearchTimer.View.Broadcast.prototype = new Gui.Epg.View.Broadcasts.List.Broadcast();

/**
 * render dom
 */
Gui.SearchTimer.View.Broadcast.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    this.addChannel();
};

/**
 * override method as its not needed here
 * @returns {Gui.EpgSearch.View.Broadcast}
 */
Gui.SearchTimer.View.Broadcast.prototype.setWidth = function () {

    return this;
};

/**
 * override method as its not needed here
 * @returns {Gui.EpgSearch.View.Broadcast}
 */
Gui.SearchTimer.View.Broadcast.prototype.addChannel = function () {

    if (!this.channel) {
        this.channel = $('<span class="channel">')
            .text(this.getChannelName())
            .appendTo(this.channelView);
    }
};
