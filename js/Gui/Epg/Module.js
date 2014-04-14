/**
 * Epg Module
 * @constructor
 */
Gui.Epg = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Epg.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Epg.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.Epg.prototype.name = 'Epg';

/**
 * dispatch default view
 */
Gui.Epg.prototype.dispatch = function () {

    this.store = VDRest.app.getModule('VDRest.Epg');
    this.getController('Epg').dispatchView();
};

/**
 * dispatch default view
 */
Gui.Epg.prototype.destruct = function () {

    this.getController('Epg').destructView();
    this.cache.flush();
};

/**
 * retrieve date object of chosen EPG start time
 * @returns {*}
 */
Gui.Epg.prototype.getFromDate = function () {

    return this.store[VDRest.config.getItem('lastEpg')];
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Epg', true);