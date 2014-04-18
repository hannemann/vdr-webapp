
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
};

Gui.Window.View.Directory.prototype.addClasses = function () {

    var classNames = ['recordings'];

    this.body.addClass('recordings-list simple-list clearer');

    this.node.addClass(classNames.join(' '));
    return this;
};