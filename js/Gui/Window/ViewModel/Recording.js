/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Recording = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Window.ViewModel.Recording.prototype = new VDRest.Abstract.ViewModel();

Gui.Window.ViewModel.Recording.prototype.cacheKey = 'number';

Gui.Window.ViewModel.Recording.prototype.init = function () {

    this.resource = this.data.resource;

    this.initViewMethods();
};