/**
 * @constructor
 */
Gui.Video.View.Player.Controls.Trigger.Minimize = function () {};

/**
 * @type {Gui.Video.View.Player.Controls.Trigger.Abstract}
 */
Gui.Video.View.Player.Controls.Trigger.Minimize.prototype = new Gui.Video.View.Player.Controls.Trigger.Abstract();

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.Minimize.prototype.symbolMinimize = "O";

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.Minimize.prototype.symbolMaximize = "P";

/**
 * @type {{on: string, off: string}}
 */
Gui.Video.View.Player.Controls.Trigger.Minimize.prototype.symbols = {
    "on" : Gui.Video.View.Player.Controls.Trigger.Minimize.prototype.symbolMaximize,
    "off" : Gui.Video.View.Player.Controls.Trigger.Minimize.prototype.symbolMinimize
};

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.Minimize.prototype.state = 'off';

/**
 * @type {string}
 */
Gui.Video.View.Player.Controls.Trigger.Minimize.prototype.className = 'minimize';

/**
 * toggle state if applicable
 */
Gui.Video.View.Player.Controls.Trigger.Minimize.prototype.toggleState = function () {

    if ("undefined" !== typeof this.symbols) {
        if (true === this.data.parent.data.player.isMinimized) {
            this.state = 'on';
        } else {
            this.state = 'off';
        }
        this.node[0].innerHTML = this.symbols[this.state];
    }
};
