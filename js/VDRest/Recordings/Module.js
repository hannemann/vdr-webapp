/**
 * Timer Module
 * @constructor
 */
VDRest.Recordings = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.Recordings.prototype = new VDRest.Abstract.Module();

/**
 * Modulename
 * @type {string}
 */
VDRest.Recordings.prototype.name = 'Recordings';

/**
 * not really implemented yet
 * @param type
 * @param broadcast
 * @returns {*|VDRest.Abstract.View}
 */
VDRest.Recordings.prototype.dispatchView = function (type, timer) {

    return this.getController(type, timer).dispatchView(type);
};

/**
 * initialize channels controller
 */
VDRest.Recordings.prototype.initList = function () {

    this.getController('List');
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Recordings', true);
