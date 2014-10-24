/**
 * Epg Module
 * @constructor
 */
Gui.EpgSearch = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.EpgSearch.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.EpgSearch.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.EpgSearch.prototype.name = 'EpgSearch';

/**
 * Module depends on vdr plugin epgsearch
 * @type {string}
 */
Gui.EpgSearch.prototype.pluginDependency = 'epgsearch';

/**
 * show up in drawer
 * @type {string}
 */
Gui.EpgSearch.prototype.inDrawer = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.EpgSearch.prototype.headline = 'EPG Search';

/**
 * dispatch default view
 */
Gui.EpgSearch.prototype.dispatch = function () {

    this.getController('Search').dispatchView();
};

/**
 * flush cache, destruct view
 */
Gui.EpgSearch.prototype.destruct = function () {

    this.getController('Search').destructView(true);
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.EpgSearch', true);