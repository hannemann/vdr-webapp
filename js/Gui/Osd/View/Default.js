/**
 * @class
 * @constructor
 */
Gui.Osd.View.Default = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Osd.View.Default.prototype = new VDRest.Abstract.View();

/**
 * init nodes
 */
Gui.Osd.View.Default.prototype.init = function () {

    this.node = $('<div id="osd">');
    this.osd = $('<div id="osd-items">');
    this.colorButtons = $('<div id="osd-buttons">');
};

/**
 * initiall render
 */
Gui.Osd.View.Default.prototype.render = function () {

    this.node = $('<div id="osd">');
    this.osd.appendTo(this.node);

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add color buttons
 */
Gui.Osd.View.Default.prototype.addButtons = function () {

    this.red = $('<div class="color-button red">');
    this.green = $('<div class="color-button green">');
    this.yellow = $('<div class="color-button yellow">');
    this.blue = $('<div class="color-button blue">');

    this.red.text(this.data.TextOsd.red).appendTo(this.colorButtons);
    this.green.text(this.data.TextOsd.green).appendTo(this.colorButtons);
    this.yellow.text(this.data.TextOsd.yellow).appendTo(this.colorButtons);
    this.blue.text(this.data.TextOsd.blue).appendTo(this.colorButtons);

    return this;
};

/**
 * render items
 */
Gui.Osd.View.Default.prototype.renderItems = function () {

    var i= 0, items = this.data.TextOsd.items, l = items.length;

    for (i; i<l; i++) {

        this.addItem(items[i]);
    }
};

/**
 * add items
 */
Gui.Osd.View.Default.prototype.addItem = function (item) {

    var node = $('<pre class="osd-item">').text(item.content);

    if (item.is_selected) {
        node.addClass('selected');
    }

    node.appendTo(this.osd);
};

/**
 * repaint osd
 */
Gui.Osd.View.Default.prototype.rePaint = function () {

    this.colorButtons.empty();
    this.osd.empty();
    this.addButtons().renderItems();
};
