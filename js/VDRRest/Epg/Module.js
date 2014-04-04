/**
 * EPG Module
 * @constructor
 */
VDRest.Epg = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.Epg.prototype = new VDRest.Abstract.Module();

/**
 * Modulename
 * @type {string}
 */
VDRest.Epg.prototype.name = 'Epg';

/**
 * not really implemented yet
 * @param type
 * @param broadcast
 * @returns {*|VDRest.Abstract.View}
 */
VDRest.Epg.prototype.dispatchView = function (type, broadcast) {

    return this.getController(type, broadcast).dispatchView(type);
};

/**
 * initialize channels controller
 */
VDRest.Epg.prototype.initChannels = function () {

    this.getController('Channels');
};

/**
 * register module
 */
VDRest.app.registerModule('Epg', true);


/**
 * Im Controller wird der view in das Model gestopft. dieses reichert den view um benötigte Methoden zur darstellung an
 *
 *
 * Model:
 *
 * this.view = this.getData('view');
 *
 * this.view.getDate = function () {
 *
 *     return helper.getStrToDate(this.getData('start_timestamp'));
 * }
 *
 * usw.
 *
 *
 * Der view rendert dann den ganzen rotz
 */
