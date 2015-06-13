Gui.Video.View.Player.Controls.Quality = function () {};

Gui.Video.View.Player.Controls.Quality.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.Quality.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.View.Player.Controls.Quality.prototype.init = function () {

    this.player = this.data.player;

    this.node = $('<div class="quality-select">');
    this.node.attr('data-animate', 'opacity');
};

/**
 * render
 */
Gui.Video.View.Player.Controls.Quality.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);
    setTimeout(function () {
        this.node.addClass('show');
    }.bind(this), 20);
};
