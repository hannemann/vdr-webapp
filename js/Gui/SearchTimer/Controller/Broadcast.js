/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.Broadcast = function () {
};

/**
 * @type {Gui.EpgSearch.Controller.Broadcast}
 */
Gui.SearchTimer.Controller.Broadcast.prototype = new Gui.EpgSearch.Controller.Broadcast();

/**
 * destruct view
 */
Gui.SearchTimer.Controller.Broadcast.prototype.destructView = function () {

    this.module.cache.flushByClassKey(this);
    VDRest.Abstract.Controller.prototype.destructView.call(this);
};