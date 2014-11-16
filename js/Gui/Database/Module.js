/**
 * Remote frontend Module
 * @constructor
 */
Gui.Database = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Database.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Database.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Database.prototype.name = 'Remote';

/**
 * dispatch default view
 * @param {Object} parentView
 */
Gui.Database.prototype.dispatch = function (parentView) {

    this.backend = VDRest.app.getModule('VDRest.Remote').getModel('Remote');

    this.getController('Default', {
        "parentView" : parentView,
        "keys" : VDRest.app.getModule('VDRest.Remote').getModel('Remote').getKeys()
    }).dispatchView();
};

/**
 * destroy remote
 */
Gui.Database.prototype.destruct = function () {

    this.getController('NumPad').destructView();
    this.getController('DPad').destructView();
    this.getController('Default').destructView();
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Database', true);
