/**
 * @class
 * @constructor
 */
Gui.Recordings.ViewModel.List.Directory = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Recordings.ViewModel.List.Directory.prototype = new VDRest.Abstract.ViewModel();

/**
 * @type {string}
 */
Gui.Recordings.ViewModel.List.Directory.prototype.cacheKey = 'path';

/**
 * initialize view
 */
Gui.Recordings.ViewModel.List.Directory.prototype.init = function () {

    this.resource = this.data.resource;

    this.initViewMethods();
};