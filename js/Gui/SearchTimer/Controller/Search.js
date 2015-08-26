/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.Search = function () {
};

/**
 * @type {Gui.EpgSearch.Controller.Search}
 */
Gui.SearchTimer.Controller.Search.prototype = new Gui.EpgSearch.Controller.Search();

/**
 * @type {string}
 */
Gui.SearchTimer.Controller.Search.prototype.eventPrefix = 'SearchTimerTest';
