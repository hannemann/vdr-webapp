/**
 * Info Module
 * @constructor
 */
Gui.Info = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Info.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Info.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Info.prototype.name = 'Info';

/**
 * show up in drawer
 * @type {string}
 */
Gui.Info.prototype.inDrawer = true;

/**
 * start page capable
 * @type {string}
 */
Gui.Info.prototype.startPage = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Info.prototype.headline = 'Info';

/**
 * dispatch default view
 */
Gui.Info.prototype.dispatch = function () {

    this.getStore();
    this.getController('Default').dispatchView();
};

Gui.Info.prototype.getStore = function () {

    if (!this.store) {
        this.store = VDRest.app.getModule('VDRest.Info');
    }
};

/**
 * dispatch default view
 */
Gui.Info.prototype.destruct = function () {

    this.getController('Default').destructView();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Info', true);
