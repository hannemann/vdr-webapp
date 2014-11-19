/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Directory = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.Directory.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.Directory.prototype.cacheKey = 'id';

/**
 * initialize view
 */
Gui.Window.Controller.Directory.prototype.init = function () {

    var path = this.data.path;

    this.header = VDRest.app.getModule('Gui.Menubar').getView('Default').getHeader();
    this.oldHeader = this.header.text();
    this.header.text(path.replace('root~', '').replace(/~/g, '/'));

    this.eventPrefix = 'window.directory.' + path.replace(/\s/g, '.');

    this.view = this.module.getView('Directory', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * destroy
 */
Gui.Window.Controller.Directory.prototype.destructView = function () {

    this.header.text(this.oldHeader);
    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    this.module.cache.invalidateAllTypes(this);
};