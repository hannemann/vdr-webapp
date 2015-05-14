/**
 * @class
 * @constructor
 * @property {function(): searchTimerFormConfig} getSearchFormData
 */
Gui.SearchTimer.View.Window.SearchTimer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.SearchTimer.View.Window.SearchTimer.prototype = new Gui.Window.View.Abstract();

/**
 * @type {string}
 */
Gui.SearchTimer.View.Window.SearchTimer.prototype.cacheKey = 'id';

/**
 * @type {boolean}
 */
Gui.SearchTimer.View.Window.SearchTimer.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.SearchTimer.View.Window.SearchTimer.prototype.isModalTransparent = true;

/**
 * @type {boolean}
 */
Gui.SearchTimer.View.Window.SearchTimer.prototype.hasHeader = false;

/**
 * render
 */
Gui.SearchTimer.View.Window.SearchTimer.prototype.render = function () {

    this.addClasses();

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * add classes
 * @return {Gui.SearchTimer.View.Window.SearchTimer}
 */
Gui.SearchTimer.View.Window.SearchTimer.prototype.addClasses = function () {

    this.node.addClass('collapsed searchtimer window-form');
    return this;
};
