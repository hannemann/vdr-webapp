/**
 * @class
 * @constructor
 */
Gui.Window.View.Directory = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Directory.prototype = new Gui.Window.View.Abstract();

/**
 * @type {string}
 */
Gui.Window.View.Directory.prototype.cacheKey = 'path';

/**
 * decorate and render
 */
Gui.Window.View.Directory.prototype.render = function () {

    this.addClasses();

    this.data.dispatch(this);

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * add classes
 * @returns {Gui.Window.View.Directory}
 */
Gui.Window.View.Directory.prototype.addClasses = function () {

    var classNames = ['recordings', 'viewport-fullsize', 'collapsed'];

    this.body.addClass('recordings-list simple-list clearer');

    this.node.addClass(classNames.join(' '));
    return this;
};

/**
 * destroy window
 */
Gui.Window.View.Directory.prototype.destruct = function () {

    var me = this;
    // apply animation
    this.node.toggleClass('collapse expand');
    // remove on animation end
    this.node.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

        Gui.Window.View.Abstract.prototype.destruct.call(me);
    });
};