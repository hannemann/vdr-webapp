/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.Broadcasts = function () {};

/**
 * @type {Gui.Epg.Controller.Broadcasts}
 */
Gui.SearchTimer.Controller.Broadcasts.prototype = new Gui.EpgSearch.Controller.Broadcasts();

/**
 * @type {string}
 */
Gui.SearchTimer.Controller.Broadcasts.prototype.itemController = 'Broadcasts.Broadcast';
