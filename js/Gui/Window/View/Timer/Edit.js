/**
 * @class
 * @constructor
 */
Gui.Window.View.Timer.Edit = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Timer.Edit.prototype = new Gui.Window.View.Abstract();

/**
 * @type {string}
 */
Gui.Window.View.Timer.Edit.prototype.cacheKey = 'id';

/**
 * @type {boolean}
 */
Gui.Window.View.Timer.Edit.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Timer.Edit.prototype.isModalTransparent = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Timer.Edit.prototype.hasHeader = true;