/**
 * @constructor
 */
Gui.Video.View.Player.Controls.Trigger.Play = function () {};

/**
 * @type {Gui.Video.View.Player.Controls.Trigger.Abstract}
 */
Gui.Video.View.Player.Controls.Trigger.Play.prototype = new Gui.Video.View.Player.Controls.Trigger.Abstract();

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.Play.prototype.symbolPlay = "C";

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.Play.prototype.symbolPause = "B";

/**
 * @type {{on: string, off: string}}
 */
Gui.Video.View.Player.Controls.Trigger.Play.prototype.symbols = {
    "on" : Gui.Video.View.Player.Controls.Trigger.Play.prototype.symbolPause,
    "off" : Gui.Video.View.Player.Controls.Trigger.Play.prototype.symbolPlay
};

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.Play.prototype.state = 'off';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.Play.prototype.className = 'play';

/**
 * initialize
 */
Gui.Video.View.Player.Controls.Trigger.Play.prototype.init = function () {

    if (this.data.parent.data.player.isPlaying) {
        this.state = 'on';
    }
    Gui.Video.View.Player.Controls.Trigger.Abstract.prototype.init.call(this);
};

/**
 * toggle state if applicable
 */
Gui.Video.View.Player.Controls.Trigger.Play.prototype.setState = function (state) {

    this.state = state;
    this.node[0].innerHTML = this.symbols[this.state];
};
