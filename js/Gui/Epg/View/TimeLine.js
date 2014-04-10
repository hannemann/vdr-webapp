/**
 * @class
 * @constructor
 *
 * @method {Date} getStartDate
 * @method {Gui.Epg.View.TimeLine} setStartDate Date
 * @method {boolean} hetStartDate
 */
Gui.Epg.View.TimeLine = function () {};

/**
 * @type {VDRest.Lib.Cache.store.View}
 */
Gui.Epg.View.TimeLine.prototype = new VDRest.Abstract.View();

/**
 * initialize node
 */
Gui.Epg.View.TimeLine.prototype.init = function () {

    this.node = $('<div id="time-line">');


};