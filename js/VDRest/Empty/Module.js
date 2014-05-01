/**
 * Timer Module
 * @constructor
 */
VDRest.Timer = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.Timer.prototype = new VDRest.Abstract.Module();

/**
 * Modulename
 * @type {string}
 */
VDRest.Timer.prototype.name = 'Timer';

/**
 * not really implemented yet
 * @param type
 * @param broadcast
 * @returns {*|VDRest.Abstract.View}
 */
VDRest.Timer.prototype.dispatchView = function (type, timer) {

    return this.getController(type, timer).dispatchView(type);
};

/**
 * initialize channels controller
 */
VDRest.Timer.prototype.initList = function () {

    this.getController('List');
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Timer', true);
