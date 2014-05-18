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
 * preload recordings
 */
VDRest.Recordings.prototype.initLate = function () {

    this.getModel('List').initList();
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Recordings', true);
