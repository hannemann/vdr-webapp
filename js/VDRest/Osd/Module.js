/**
 * Timer Module
 * @constructor
 */
VDRest.Osd = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.Osd.prototype = new VDRest.Abstract.Module();

/**
 * Modulename
 * @type {string}
 */
VDRest.Osd.prototype.name = 'Osd';

/**
 * initialize channels controller
 */
VDRest.Osd.prototype.initOsd = function () {

    this.getController('Osd');
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Osd', true);
