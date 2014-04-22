
Gui.Window.View.Directory = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Directory.prototype = new Gui.Window.View.Abstract();

Gui.Window.View.Directory.prototype.cacheKey = 'path';

Gui.Window.View.Directory.prototype.render = function () {

    this.data.node.setParentView(this);

    this.addClasses();

    this.data.dispatch();

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

Gui.Window.View.Directory.prototype.addClasses = function () {

    var classNames = ['recordings', 'viewport-fullsize', 'collapsed'];

    this.body.addClass('recordings-list simple-list clearer');

    this.node.addClass(classNames.join(' '));
    return this;
};

Gui.Window.View.Directory.prototype.destruct = function () {

    var me = this;
    // apply animation
    this.node.toggleClass('collapse expand');
    // remove on animation end
    this.node.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

        Gui.Window.View.Abstract.prototype.destruct.call(me);
    });
};