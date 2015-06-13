Gui.Video.View.Player.Controls.Trigger = function () {};

/**
 * @constructor
 */
Gui.Video.View.Player.Controls.Trigger.Abstract = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Video.View.Player.Controls.Trigger.Abstract.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.Trigger.Abstract.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Video.View.Player.Controls.Trigger.Abstract.prototype.init = function () {

    this.node = $('<div>');
    this.node[0].classList.add('vdr-web-symbol');
    this.node[0].classList.add(this.className);

    if ("undefined" !== typeof this.symbols) {
        this.node[0].innerHTML = this.symbols[this.state];
    } else {
        this.node[0].innerHTML = this.symbol;
    }
};

/**
 * toggle state if applicable
 */
Gui.Video.View.Player.Controls.Trigger.Abstract.prototype.toggleState = function () {

    if ("undefined" !== typeof this.symbols) {
        if ('on' === this.state) {
            this.state = 'off';
        } else {
            this.state = 'on';
        }
        this.node[0].innerHTML = this.symbols[this.state];
    }
};
