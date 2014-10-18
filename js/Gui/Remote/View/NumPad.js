/**
 * @class
 * @constructor
 */
Gui.Remote.View.NumPad = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Remote.View.NumPad.prototype = new VDRest.Abstract.View();

Gui.Remote.View.NumPad.prototype.symbolOne      = '1';
Gui.Remote.View.NumPad.prototype.symbolTwo      = '2';
Gui.Remote.View.NumPad.prototype.symbolThree    = '3';
Gui.Remote.View.NumPad.prototype.symbolFour     = '4';
Gui.Remote.View.NumPad.prototype.symbolFive     = '5';
Gui.Remote.View.NumPad.prototype.symbolSix      = '6';
Gui.Remote.View.NumPad.prototype.symbolSeven    = '7';
Gui.Remote.View.NumPad.prototype.symbolEight    = '8';
Gui.Remote.View.NumPad.prototype.symbolNine     = '9';
Gui.Remote.View.NumPad.prototype.symbolZero     = '0';

/**
 * init nodes
 */
Gui.Remote.View.NumPad.prototype.init = function () {

    this.node = $('<div id="remote-numpad">');
    this.buttons = $('<div class="remote-buttons">');
};

/**
 * initialize render
 */
Gui.Remote.View.NumPad.prototype.render = function () {

    this.buttons.appendTo(this.node);

    this.addButtons();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add color buttons
 */
Gui.Remote.View.NumPad.prototype.addButtons = function () {

    this.one    = $('<div class="remote-numpad-button one">')  .text(this.symbolOne)    .appendTo(this.node);
    this.two    = $('<div class="remote-numpad-button two">')  .text(this.symbolTwo)    .appendTo(this.node);
    this.three  = $('<div class="remote-numpad-button three">').text(this.symbolThree)  .appendTo(this.node);
    this.four   = $('<div class="remote-numpad-button four">') .text(this.symbolFour)   .appendTo(this.node);
    this.five   = $('<div class="remote-numpad-button five">') .text(this.symbolFive)   .appendTo(this.node);
    this.six    = $('<div class="remote-numpad-button six">')  .text(this.symbolSix)    .appendTo(this.node);
    this.seven  = $('<div class="remote-numpad-button seven">').text(this.symbolSeven)  .appendTo(this.node);
    this.eight  = $('<div class="remote-numpad-button eight">').text(this.symbolEight)  .appendTo(this.node);
    this.nine   = $('<div class="remote-numpad-button nine">') .text(this.symbolNine)   .appendTo(this.node);
    this.zero   = $('<div class="remote-numpad-button zero">') .text(this.symbolZero)   .appendTo(this.node);

    return this;
};

/**
 * destroy!
 */
Gui.Remote.View.NumPad.prototype.destruct = function () {

    this.node.empty();

    VDRest.Abstract.View.prototype.destruct.call(this);
};
