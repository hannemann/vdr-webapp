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
    this.addThrobber();
};

/**
 * add throbber
 */
Gui.Video.View.Player.Video.prototype.addThrobber = function () {

    this.throbber = $(
        '<div style="background-image: url('
        + VDRest.image.getThrobber()
        + ')" class="throbber">'
    );
    this.throbber.appendTo(this.data.player.view.node);

    return this;
};

/**
 * set poster with icon
 */
Gui.Video.View.Player.Video.prototype.destruct = function () {

    this.throbber.remove();
    delete this.throbber;
    this.node[0].pause();
    this.node.prop('src', false);
    this.node.remove();
    delete this.node;
};