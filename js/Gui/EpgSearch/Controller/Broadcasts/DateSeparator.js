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
Gui.EpgSearch.Controller.Broadcasts.DateSeparator = function () {};

/**
 * @type {Gui.Epg.Controller.Broadcasts.List.DateSeparator}
 */
Gui.EpgSearch.Controller.Broadcasts.DateSeparator.prototype = new Gui.Epg.Controller.Broadcasts.List.DateSeparator();

/**
 * initialize
 */
Gui.EpgSearch.Controller.Broadcasts.DateSeparator.prototype.init = function () {

    this.view = this.module.getView('Broadcasts.DateSeparator', this.data);

    this.view.setParentView(this.data.parent.view);
};
