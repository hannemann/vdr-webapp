/**
 * @class
 * @constructor
 */
Gui.Remote.View.DPad = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Remote.View.DPad.prototype = new VDRest.Abstract.View();

Gui.Remote.View.DPad.prototype.symbolUp     = 'd';
Gui.Remote.View.DPad.prototype.symbolDown   = 'a';
Gui.Remote.View.DPad.prototype.symbolLeft   = 'b';
Gui.Remote.View.DPad.prototype.symbolRight  = 'c';
Gui.Remote.View.DPad.prototype.symbolOk     = 'Ok';
Gui.Remote.View.DPad.prototype.symbolMenu   = 'Menu';
Gui.Remote.View.DPad.prototype.symbolBack   = 'e';
Gui.Remote.View.DPad.prototype.symbolInfo   = 'i';

/**
 * init nodes
 */
Gui.Remote.View.DPad.prototype.init = function () {

    this.node = $('<div id="remote-dpad" class="remote-group">');
};

/**
 * initialize render
 */
Gui.Remote.View.DPad.prototype.render = function () {

    this.addButtons();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add color buttons
 */
Gui.Remote.View.DPad.prototype.addButtons = function () {

    this.up     = $('<div class="remote-button up vdr-web-symbol">')      .text(this.symbolUp)       .appendTo(this.node);
    this.left   = $('<div class="remote-button left vdr-web-symbol">')    .text(this.symbolLeft)     .appendTo(this.node);
    this.ok     = $('<div class="remote-button ok">')      .text(this.symbolOk)       .appendTo(this.node);
    this.right  = $('<div class="remote-button right vdr-web-symbol">')   .text(this.symbolRight)    .appendTo(this.node);
    this.down   = $('<div class="remote-button down vdr-web-symbol">')    .text(this.symbolDown)     .appendTo(this.node);
    this.menu   = $('<div class="remote-button menu">')    .text(this.symbolMenu)     .appendTo(this.node);
    this.back   = $('<div class="remote-button back vdr-web-symbol">')    .text(this.symbolBack)     .appendTo(this.node);
    this.info   = $('<div class="remote-button info vdr-web-symbol">')    .text(this.symbolInfo)     .appendTo(this.node);

    return this;
};

/**
 * destroy!
 */
Gui.Remote.View.DPad.prototype.destruct = function () {

    this.node.empty();

    VDRest.Abstract.View.prototype.destruct.call(this);
};
