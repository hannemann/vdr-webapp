/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Timer.Edit = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Window.ViewModel.Timer.Edit.prototype = new Gui.Timer.ViewModel.List.Timer();

/**
 * @type {string}
 */
Gui.Window.ViewModel.Timer.Edit.prototype.cacheKey = 'id';