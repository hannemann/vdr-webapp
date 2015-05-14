/**
 * @class
 * @constructor
 */
Gui.Recordings.Controller.Window.Directory = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Recordings.Controller.Window.Directory.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Recordings.Controller.Window.Directory.prototype.cacheKey = 'id';

/**
 * initialize view
 */
Gui.Recordings.Controller.Window.Directory.prototype.init = function () {

    var path = this.data.path;

    this.header = VDRest.app.getModule('Gui.Menubar').getView('Default').getHeader();
    this.oldHeader = this.header.text();
    this.header.text(path.replace('root~', '').replace(/~/g, '/'));

    this.eventPrefix = 'window.directory.' + path.replace(/\s/g, '.').toCacheKey();

    this.view = this.module.getView('Window.Directory', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * destroy
 */
Gui.Recordings.Controller.Window.Directory.prototype.destructView = function () {

    this.header.text(this.oldHeader);
    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    this.module.cache.invalidateAllTypes(this);
};