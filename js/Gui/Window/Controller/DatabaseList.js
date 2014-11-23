/**
 * @class
 * @constructor
 */
Gui.Window.Controller.DatabaseList = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.DatabaseList.prototype = new Gui.Window.Controller.Abstract();


Gui.Window.Controller.DatabaseList.prototype.bypassCache = true;

/**
 * initialize view
 */
Gui.Window.Controller.DatabaseList.prototype.init = function () {

    this.eventPrefix = 'window.databaselist';

    this.view = this.module.getView('DatabaseList', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * destroy
 */
Gui.Window.Controller.DatabaseList.prototype.destructView = function () {

    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    this.module.cache.invalidateAllTypes(this);
};