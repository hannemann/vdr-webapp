/**
 * Remote frontend Module
 * @constructor
 */
Gui.Remote = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Remote.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Remote.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Remote.prototype.name = 'Remote';

/**
 * dispatch default view
 * @param {Object} parentView
 */
Gui.Remote.prototype.dispatch = function (parentView) {

    this.backend = VDRest.app.getModule('VDRest.Remote').getModel('Remote');

    this.getController('Default', {
        "parentView" : parentView,
        "keys" : VDRest.app.getModule('VDRest.Remote').getModel('Remote').getKeys()
    }).dispatchView();
};

/**
 * destroy remote
 */
Gui.Remote.prototype.destruct = function () {

    this.getController('NumPad').destructView();
    this.getController('DPad').destructView();
    this.getController('Default').destructView();
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Remote', true);
