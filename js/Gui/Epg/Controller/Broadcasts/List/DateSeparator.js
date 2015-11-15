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
Gui.Epg.Controller.Broadcasts.List.DateSeparator = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.Controller.Broadcasts.List.DateSeparator.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.Epg.Controller.Broadcasts.List.DateSeparator.prototype.cacheKey = 'timestamp/channel_id';

/**
 * initialize
 */
Gui.Epg.Controller.Broadcasts.List.DateSeparator.prototype.init = function () {

    this.view = this.module.getView('Broadcasts.List.DateSeparator', this.data);

    this.view.setParentView(this.data.parent.view);
};