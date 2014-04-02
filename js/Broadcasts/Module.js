var Broadcasts = function () {};

Broadcasts.prototype = new Abstract.Module();

Broadcasts.prototype.name = 'Broadcasts';

Broadcasts.prototype.dispatchView = function (type, broadcast) {

    return this.getController(type, broadcast).dispatchView(type);
};

Broadcasts.prototype.initChannels = function () {

    this.getController('Channels');
};

main.registerModule('Broadcasts', true);


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
