/**
 * @constructor
 */
Gui.Video.View.Player.Controls.Trigger.ToggleFullScreen = function () {};

/**
 * @type {Gui.Video.View.Player.Controls.Trigger.Abstract}
 */
Gui.Video.View.Player.Controls.Trigger.ToggleFullScreen.prototype = new Gui.Video.View.Player.Controls.Trigger.Abstract();

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.ToggleFullScreen.prototype.symbolFullscreen = "Q";

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.ToggleFullScreen.prototype.symbolExitFullscreen = "R";

/**
 * @type {{on: string, off: string}}
 */
Gui.Video.View.Player.Controls.Trigger.ToggleFullScreen.prototype.symbols = {
    "on" : Gui.Video.View.Player.Controls.Trigger.ToggleFullScreen.prototype.symbolExitFullscreen,
    "off" : Gui.Video.View.Player.Controls.Trigger.ToggleFullScreen.prototype.symbolFullscreen
};

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.ToggleFullScreen.prototype.state = 'off';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.ToggleFullScreen.prototype.className = 'toggle-fullScreen';
