/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Window.ViewModel.SearchTimer.prototype = new Gui.SearchTimer.ViewModel.List.SearchTimer();

/**
 * @type {string}
 */
Gui.Window.ViewModel.SearchTimer.prototype.cacheKey = 'id';

/**
 * initialize resources
 */
Gui.Window.ViewModel.SearchTimer.prototype.init = function () {

    this.resource = this.data.resource;

    this.initViewMethods();
};

/**
 * add magic methods
 */
Gui.Window.ViewModel.SearchTimer.prototype.initViewMethods = function () {

//    var me = this;

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);
};
