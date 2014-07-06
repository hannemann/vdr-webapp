/**
 * @class
 * @constructor
 */
Gui.SearchTimer.View.List = function () {};

Gui.SearchTimer.View.List.prototype = new VDRest.Abstract.View();

/**
 * init node
 */
Gui.SearchTimer.View.List.prototype.init = function () {

    this.node = $('<div id="searchtimer-list" class="simple-list clearer">');
};