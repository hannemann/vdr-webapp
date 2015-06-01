/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.Search = function () {
};

/**
 * @type {Gui.EpgSearch.Controller.Search}
 */
Gui.SearchTimer.Controller.Search.prototype = new Gui.EpgSearch.Controller.Search();

/**
 * @type {string}
 */
Gui.SearchTimer.Controller.Search.prototype.eventPrefix = 'SearchTimerTest';

/**
 * destruct view
 */
Gui.SearchTimer.Controller.Search.prototype.destructView = function () {

    var i = 0, l = this.broadcastList.length;
    this.module.cache.flushByClassKey(this);
    VDRest.Abstract.Controller.prototype.destructView.call(this);

    for (i; i < l; i++) {

        this.broadcastList[i].destructView();
    }
};