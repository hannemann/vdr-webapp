/**
 * separate broadcasts by hour
 * @constructor
 * @property {{}} data
 * @property {Date} data.date
 * @property {number} data.timestamp
 * @property {number} data.position
 * @property {Gui.Epg.View.Broadcasts.List} parentView
 */
Gui.EpgSearch.View.Broadcasts.DateSeparator = function () {};

/**
 * @type {Gui.Epg.View.Broadcasts.List.DateSeparator}
 */
Gui.EpgSearch.View.Broadcasts.DateSeparator.prototype = new Gui.Epg.View.Broadcasts.List.DateSeparator();
