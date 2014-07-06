/**
 * @class
 * @constructor
 */
Gui.SearchTimer.View.List.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.SearchTimer.View.List.SearchTimer.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.cacheKey = 'id';

/**
 * initialize nodes
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.init = function () {


    // TODO: create own css?
    this.node = $('<div class="timer list-item clearer">');
};

/**
 * decorate and render
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.render = function () {

    this.decorate();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * decorate
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.decorate = function () {

    this.addClasses();
};

/**
 * call decorator
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.update = function () {

    this.decorate();
};

/**
 * add class names
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.addClasses = function () {

    this.node.toggleClass('active', this.getIsActive());

    return this;
};
