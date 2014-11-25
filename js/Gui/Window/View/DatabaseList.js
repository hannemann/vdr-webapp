/**
 * @class
 * @constructor
 */
Gui.Window.View.DatabaseList = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.DatabaseList.prototype = new Gui.Window.View.Abstract();


Gui.Window.View.DatabaseList.prototype.bypassCache = true;

/**
 * decorate and render
 */
Gui.Window.View.DatabaseList.prototype.render = function () {

    this.addClasses();

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');

    this.node.one(VDRest.Abstract.Controller.prototype.animationEndEvents, function () {
        this.data.dispatch(this);
    }.bind(this));
};

/**
 * add classes
 * @returns {Gui.Window.View.Directory}
 */
Gui.Window.View.DatabaseList.prototype.addClasses = function () {

    var classNames = ['viewport-fullsize', 'collapsed', 'database-list'];

    this.node.addClass(classNames.join(' '));
    return this;
};

/**
 * destroy window
 */
Gui.Window.View.DatabaseList.prototype.destruct = function () {

    var me = this;
    // apply animation
    this.node.toggleClass('collapse expand');
    // remove on animation end
    this.node.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

        Gui.Window.View.Abstract.prototype.destruct.call(me);
    });
};