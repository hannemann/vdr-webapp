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
