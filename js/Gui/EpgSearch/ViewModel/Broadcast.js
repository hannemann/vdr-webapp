/**
 * @class
 * @constructor
 */
Gui.EpgSearch.ViewModel.Broadcast = function () {};

/**
 * @type {Gui.Epg.ViewModel.Broadcasts.List.Broadcast}
 */
Gui.EpgSearch.ViewModel.Broadcast.prototype = new Gui.Epg.ViewModel.Broadcasts.List.Broadcast();

/**
 * init view methods
 */
Gui.EpgSearch.ViewModel.Broadcast.prototype.init = function () {

    VDRest.Helper.prototype.parseDescription.call(this, this.data.resource.data.description);

    this.initViewMethods();
};