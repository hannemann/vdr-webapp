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

    this.node = $('<div id="remote-numpad" class="remote-group">');
};

/**
 * initialize render
 */
Gui.Remote.View.NumPad.prototype.render = function () {

    this.addButtons();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add color buttons
 */
Gui.Remote.View.NumPad.prototype.addButtons = function () {

    this.one    = $('<div class="remote-button one">')  .text(this.symbolOne)    .appendTo(this.node);
    this.two    = $('<div class="remote-button two">')  .text(this.symbolTwo)    .appendTo(this.node);
    this.three  = $('<div class="remote-button three">').text(this.symbolThree)  .appendTo(this.node);
    this.four   = $('<div class="remote-button four">') .text(this.symbolFour)   .appendTo(this.node);
    this.five   = $('<div class="remote-button five">') .text(this.symbolFive)   .appendTo(this.node);
    this.six    = $('<div class="remote-button six">')  .text(this.symbolSix)    .appendTo(this.node);
    this.seven  = $('<div class="remote-button seven">').text(this.symbolSeven)  .appendTo(this.node);
    this.eight  = $('<div class="remote-button eight">').text(this.symbolEight)  .appendTo(this.node);
    this.nine   = $('<div class="remote-button nine">') .text(this.symbolNine)   .appendTo(this.node);
    this.zero   = $('<div class="remote-button zero">') .text(this.symbolZero)   .appendTo(this.node);
    $('<div class="additional">').text('.,-')   .appendTo(this.one);
    $('<div class="additional">').text('abc')   .appendTo(this.two);
    $('<div class="additional">').text('def')   .appendTo(this.three);
    $('<div class="additional">').text('ghi')   .appendTo(this.four);
    $('<div class="additional">').text('jkl')   .appendTo(this.five);
    $('<div class="additional">').text('mno')   .appendTo(this.six);
    $('<div class="additional">').text('pqrs')  .appendTo(this.seven);
    $('<div class="additional">').text('tuv')   .appendTo(this.eight);
    $('<div class="additional">').text('wxyz')  .appendTo(this.nine);
    $('<div class="additional">').text('_')     .appendTo(this.zero);

    return this;
};

/**
 * destroy!
 */
Gui.Remote.View.NumPad.prototype.destruct = function () {

    this.node.empty();

    VDRest.Abstract.View.prototype.destruct.call(this);
};
