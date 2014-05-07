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
 * override method as its not needed here
 * @returns {Gui.EpgSearch.View.Broadcast}
 */
Gui.EpgSearch.View.Broadcast.prototype.setWidth = function () {

    return this;
};
