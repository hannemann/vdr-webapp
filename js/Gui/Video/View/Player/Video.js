/**
 * @constructor
 */
Gui.Video.View.Player.Video = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Video.View.Player.Video.prototype = new VDRest.Abstract.View();

/**
 * initialize
 */
Gui.Video.View.Player.Video.prototype.init = function () {

    this.node = $('<video preload="none" class="normal-size">');

    if (location.host != VDRest.config.getItem('host')) {
        this.node.prop('crossOrigin', 'anonymous');
    }
};

/**
 * render tag
 */
Gui.Video.View.Player.Video.prototype.render = function () {

    this.node.prependTo(this.parentView.node);
};

/**
 * set poster with icon
 */
Gui.Video.View.Player.Video.prototype.destruct = function () {

    this.node[0].pause();
    this.node.prop('src', false);
};