/**
 * @class
 * @constructor
 */
Gui.Recordings.View.Window.Directory = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Recordings.View.Window.Directory.prototype = new Gui.Window.View.Abstract();

/**
 * @type {string}
 */
Gui.Recordings.View.Window.Directory.prototype.cacheKey = 'id';

/**
 * decorate and render
 */
Gui.Recordings.View.Window.Directory.prototype.render = function () {

    this.addClasses();

    this.data.dispatch(this);

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * add classes
 * @returns {Gui.Recordings.View.Window.Directory}
 */
Gui.Recordings.View.Window.Directory.prototype.addClasses = function () {

    var classNames = ['recordings', 'viewport-fullsize', 'collapsed'];

    this.body.addClass('recordings-list simple-list clearer');

    this.node.addClass(classNames.join(' '));
    return this;
};

/**
 * destroy window
 */
Gui.Recordings.View.Window.Directory.prototype.destruct = function () {

    var me = this;
    // apply animation
    this.node.toggleClass('collapse expand');
    // remove on animation end
    this.node.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

        Gui.Window.View.Abstract.prototype.destruct.call(me);
    });
};