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

/**
 * render
 */
Gui.SearchTimer.View.List.prototype.render = function () {

    this.node.removeClass('collapse');
    this.node.addClass('window collapsed viewport-fullsize');

    VDRest.Abstract.View.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};