/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.Broadcasts.Broadcast = function () {
};

/**
 * @type {Gui.EpgSearch.Controller.Broadcasts.Broadcast}
 */
Gui.SearchTimer.Controller.Broadcasts.Broadcast.prototype = new Gui.EpgSearch.Controller.Broadcasts.Broadcast();

/**
 * destruct view
 */
Gui.SearchTimer.Controller.Broadcasts.Broadcast.prototype.destructView = function () {

    this.module.cache.flushByClassKey(this);
    VDRest.Abstract.Controller.prototype.destructView.call(this);
};