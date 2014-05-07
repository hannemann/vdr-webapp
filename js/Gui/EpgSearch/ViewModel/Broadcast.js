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

    this.resource = this.data.resource.data;

    VDRest.Helper.prototype.parseDescription.call(this, this.resource.description);

    this.initViewMethods();
};