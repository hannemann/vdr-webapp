/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Broadcast = function () {};

/**
 * @type {VDRest.Lib.Cache.store.ViewModel}
 */
Gui.Window.ViewModel.Broadcast.prototype = new VDRest.Abstract.ViewModel();

/**
 * cache key
 * @type {string}
 */
Gui.Window.ViewModel.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * init view methods
 */
Gui.Window.ViewModel.Broadcast.prototype.init = function () {

    this.resource = this.data.resource.data;

    this.initViewMethods(this.data.view, this.resource);
};