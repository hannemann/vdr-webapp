/**
 * @class
 * @constructor
 */
Gui.EpgSearch.ViewModel.Broadcasts.Broadcast = function () {};

/**
 * @type {Gui.Epg.ViewModel.Broadcasts.List.Broadcast}
 */
Gui.EpgSearch.ViewModel.Broadcasts.Broadcast.prototype = new Gui.Epg.ViewModel.Broadcasts.List.Broadcast();

/**
 * init view methods
 */
Gui.EpgSearch.ViewModel.Broadcasts.Broadcast.prototype.init = function () {

    this.baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();

    VDRest.Helper.prototype.parseDescription.call(this, this.data.resource.data.description);

    this.initViewMethods();
};