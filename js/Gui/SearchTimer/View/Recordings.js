/**
 * @class
 * @constructor
 */
Gui.SearchTimer.View.Recordings = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.SearchTimer.View.Recordings.prototype = new VDRest.Abstract.View();

/**
 * render
 */
Gui.SearchTimer.View.Recordings.prototype.init = function () {

    this.node = $('<div class="epg-search-view simple-list">');
};

/**
 * render
 */
Gui.SearchTimer.View.Recordings.prototype.render = function () {

    this.node.addClass('window viewport-fullsize collapsed');

    VDRest.Abstract.View.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * destroy window
 */
Gui.SearchTimer.View.Recordings.prototype.destruct = function () {

    var me = this;
    // apply animation
    this.node.toggleClass('collapse expand');
    // remove on animation end
    this.node.one(VDRest.Abstract.Controller.prototype.animationEndEvents, function () {

        VDRest.Abstract.View.prototype.destruct.call(me);
    });
};
