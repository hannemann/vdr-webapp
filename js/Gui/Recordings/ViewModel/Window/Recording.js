/**
 * @class
 * @constructor
 */
Gui.Recordings.ViewModel.Window.Recording = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Recordings.ViewModel.Window.Recording.prototype = new Gui.Recordings.ViewModel.List.Recording();

/**
 * @type {string}
 */
Gui.Recordings.ViewModel.Window.Recording.prototype.cacheKey = 'id';
