/**
 * SearchTimer Module
 * @constructor
 */
VDRest.SearchTimer = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.SearchTimer.prototype = new VDRest.Abstract.Module();

/**
 * Module name
 * @type {string}
 */
VDRest.SearchTimer.prototype.name = 'SearchTimer';

/**
 * initialize list controller
 */
VDRest.SearchTimer.prototype.initList = function () {

    this.getModel('List').initList();
};

/**
 * initialize list controller
 */
VDRest.SearchTimer.prototype.initLate = function () {

    this.getController('Default');
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.SearchTimer', true);
