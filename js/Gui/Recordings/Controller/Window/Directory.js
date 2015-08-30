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

Gui.Recordings.Controller.Window.Directory.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);
    this.addObserver();
};

Gui.Recordings.Controller.Window.Directory.prototype.addObserver = function () {

    if (VDRest.helper.isTouchDevice) {
        this.preventReloadHandler = this.preventScrollReload.bind(this, this.view.body);
        this.view.node.on('touchmove', this.preventReloadHandler);
    }

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};

Gui.Recordings.Controller.Window.Directory.prototype.removeObserver = function () {

    if (VDRest.helper.isTouchDevice) {
        this.view.node.off('touchmove', this.preventReloadHandler);
    }

    Gui.Window.Controller.Abstract.prototype.removeObserver.call(this);
};

/**
 * empty window
 */
Gui.Recordings.Controller.Window.Directory.prototype.empty = function () {

    this.view.data.listItem.getDirectories().forEach(function (item) {
        item.destructView();
        this.module.cache.invalidateAllTypes(item);
    }.bind(this));
};

/**
 * destroy
 */
Gui.Recordings.Controller.Window.Directory.prototype.destructView = function () {

    this.header.text(this.oldHeader);
    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    this.module.cache.invalidateAllTypes(this);
};