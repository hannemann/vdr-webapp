/**
 * separate broadcasts by hour
 * @constructor
 * @property {{}} data
 * @property {Date} data.date
 * @property {number} data.timestamp
 * @property {number} data.position
 * @property {Gui.Epg.View.Broadcasts.List} parentView
 */
Gui.SearchTimer.View.Broadcasts.DateSeparator = function () {};

/**
 * @type {Gui.EpgSearch.View.Broadcasts.DateSeparator}
 */
Gui.SearchTimer.View.Broadcasts.DateSeparator.prototype = new Gui.EpgSearch.View.Broadcasts.DateSeparator();
