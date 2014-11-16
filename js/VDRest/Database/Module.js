/**
 * Remote frontend Module
 * @constructor
 */
VDRest.Database = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.Database.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
VDRest.Database.prototype.namespace = 'VDRest';

/**
 * Modulename
 * @type {string}
 */
VDRest.Database.prototype.name = 'Database';

/**
 * Module depends on vdr plugin scraper2vdr or tvscraper
 * @type {string}
 */
VDRest.Database.prototype.pluginDependency = 'scraper2vdr||tvscraper';

/**
 * initialize module
 */
VDRest.Database.prototype.initLate = function () {

    this.getResource('Database');
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Database', true);
