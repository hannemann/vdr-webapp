/**
 * @class
 * @constructor
 */
Gui.Remote.View.DPad = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Remote.View.DPad.prototype = new VDRest.Abstract.View();

Gui.Remote.View.DPad.prototype.symbolUp     = 'Up';
Gui.Remote.View.DPad.prototype.symbolDown   = 'Down';
Gui.Remote.View.DPad.prototype.symbolLeft   = 'Left';
Gui.Remote.View.DPad.prototype.symbolRight  = 'Right';
Gui.Remote.View.DPad.prototype.symbolOk     = 'Ok';
Gui.Remote.View.DPad.prototype.symbolMenu   = 'Menu';
Gui.Remote.View.DPad.prototype.symbolBack   = 'Back';

/**
 * init nodes
 */
Gui.Remote.View.DPad.prototype.init = function () {

    this.node = $('<div id="remote-dpad">');
    this.buttons = $('<div class="remote-buttons">');
};

/**
 * initialize render
 */
Gui.Remote.View.DPad.prototype.render = function () {

    this.buttons.appendTo(this.node);

    this.addButtons();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add color buttons
 */
Gui.Remote.View.DPad.prototype.addButtons = function () {

    this.up     = $('<div class="remote-dpad-button up">')      .text(this.symbolUp)       .appendTo(this.node);
    this.down   = $('<div class="remote-dpad-button down">')    .text(this.symbolDown)     .appendTo(this.node);
    this.left   = $('<div class="remote-dpad-button left">')    .text(this.symbolLeft)     .appendTo(this.node);
    this.right  = $('<div class="remote-dpad-button right">')   .text(this.symbolRight)    .appendTo(this.node);
    this.ok     = $('<div class="remote-dpad-button ok">')      .text(this.symbolOk)       .appendTo(this.node);
    this.menu   = $('<div class="remote-dpad-button menu">')    .text(this.symbolMenu)     .appendTo(this.node);
    this.back   = $('<div class="remote-dpad-button back">')    .text(this.symbolBack)     .appendTo(this.node);

    return this;
};

/**
 * destroy!
 */
Gui.Remote.View.DPad.prototype.destruct = function () {

    this.node.empty();

    VDRest.Abstract.View.prototype.destruct.call(this);
};
