/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Recording = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Window.ViewModel.Recording.prototype = new Gui.Recordings.ViewModel.List.Recording();

/**
 * initialize view
 */
Gui.Window.ViewModel.Recording.prototype.init = function () {

    this.resource = this.data.resource;

    this.initViewMethods();
};
