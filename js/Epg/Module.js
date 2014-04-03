var Epg = function () {};

Epg.prototype = new Abstract.Module();

Epg.prototype.name = 'Epg';

Epg.prototype.dispatchView = function (type, broadcast) {

    return this.getController(type, broadcast).dispatchView(type);
};

Epg.prototype.initChannels = function () {

    this.getController('Channels');
};

main.registerModule('Epg', true);


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
