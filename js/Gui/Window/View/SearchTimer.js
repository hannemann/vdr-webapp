/**
 * @class
 * @constructor
 */
Gui.Window.View.SearchTimer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.SearchTimer.prototype = new Gui.Window.View.Abstract();

/**
 * @type {string}
 */
Gui.Window.View.SearchTimer.prototype.cacheKey = 'id';

/**
 * @type {boolean}
 */
Gui.Window.View.SearchTimer.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.SearchTimer.prototype.isModalTransparent = true;

/**
 * @type {boolean}
 */
Gui.Window.View.SearchTimer.prototype.hasHeader = true;

Gui.Window.View.SearchTimer.prototype.init = function () {

    if (this.getData('is_new')) {

        this.hasHeader = false;
    }

    Gui.Window.View.Abstract.prototype.init.call(this);
};

/**
 * render
 */
Gui.Window.View.SearchTimer.prototype.render = function () {

    this.decorateHeader().decorateBody();

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * decorate header
 */
Gui.Window.View.SearchTimer.prototype.decorateHeader = function () {

    return this;
};

/**
 * decorate body
 */
Gui.Window.View.SearchTimer.prototype.decorateBody = function () {

    return this;
};
