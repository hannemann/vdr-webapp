/**
 * @class
 * @constructor
 */
Gui.SearchTimer.ViewModel.Broadcast = function () {
};

/**
 * @type {Gui.Epg.ViewModel.Broadcasts.List.Broadcast}
 */
Gui.SearchTimer.ViewModel.Broadcast.prototype = new Gui.Epg.ViewModel.Broadcasts.List.Broadcast();

/**
 * init view methods
 */
Gui.SearchTimer.ViewModel.Broadcast.prototype.init = function () {

    VDRest.Helper.prototype.parseDescription.call(this, this.data.resource.data.description);

    this.initViewMethods();
};