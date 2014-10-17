/**
 * Remote Module
 * @constructor
 */
VDRest.Remote = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.Remote.prototype = new VDRest.Abstract.Module();

/**
 * Modulename
 * @type {string}
 */
VDRest.Remote.prototype.name = 'Remote';

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Remote', true);
