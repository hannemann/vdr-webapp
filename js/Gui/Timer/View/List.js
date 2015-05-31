/**
 * @class
 * @constructor
 */
Gui.Timer.View.List = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Timer.View.List.prototype = new VDRest.Abstract.View();

/**
 * init node
 */
Gui.Timer.View.List.prototype.init = function () {

    this.node = $('<div id="timer-list" class="simple-list clearer">');
};

/**
 * render
 */
Gui.Timer.View.List.prototype.render = function () {

    if (!this.isRendered) {

        this.node.addClass('window collapsed viewport-fullsize');
        VDRest.Abstract.View.prototype.render.call(this);
        this.node.toggleClass('collapsed expand');
    }
};
