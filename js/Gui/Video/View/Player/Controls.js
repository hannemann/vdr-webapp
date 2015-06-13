Gui.Video.View.Player.Controls = function () {};

Gui.Video.View.Player.Controls.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.View.Player.Controls.prototype.init = function () {

    this.node = $('<div class="html5-player-controls show">');
    this.node.attr('data-animate', 'opacity');
};
