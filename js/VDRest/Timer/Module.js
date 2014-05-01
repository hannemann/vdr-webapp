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
 * Module name
 * @type {string}
 */
VDRest.Timer.prototype.name = 'Timer';

/**
 * initialize observer
 */
VDRest.Timer.prototype.initLate = function () {

    this.getModel('Observer');
};

/**
 * initialize list controller
 */
VDRest.Timer.prototype.initList = function () {

    this.getController('List');
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Timer', true);
