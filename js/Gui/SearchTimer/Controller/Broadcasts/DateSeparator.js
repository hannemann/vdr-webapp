/**
 * separate broadcasts by hour
 * @constructor
 * @property {Gui.Epg} module
 * @property {Gui.Epg.View.Broadcasts.List.DateSeparator} view
 * @property {{}} data
 * @property {Date} data.date
 * @property {number} data.timestamp
 * @property {number} data.position
 * @property {Gui.Epg.View.Broadcasts.List} parentView
 */
Gui.SearchTimer.Controller.Broadcasts.DateSeparator = function () {};

/**
 * @type {Gui.EpgSearch.Controller.Broadcasts.DateSeparator}
 */
Gui.SearchTimer.Controller.Broadcasts.DateSeparator.prototype = new Gui.EpgSearch.Controller.Broadcasts.DateSeparator();
