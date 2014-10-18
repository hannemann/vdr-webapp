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

    this.osd.appendTo(this.node);
    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * add color buttons
 */
Gui.Osd.View.Default.prototype.addButtons = function () {

    this.red = this.green = this.yellow = this.blue = undefined;

    if (this.data.TextOsd) {

        this.red = $('<div class="color-button red">');
        this.green = $('<div class="color-button green">');
        this.yellow = $('<div class="color-button yellow">');
        this.blue = $('<div class="color-button blue">');

        this.red.text(this.data.TextOsd.red).appendTo(this.colorButtons);
        this.green.text(this.data.TextOsd.green).appendTo(this.colorButtons);
        this.yellow.text(this.data.TextOsd.yellow).appendTo(this.colorButtons);
        this.blue.text(this.data.TextOsd.blue).appendTo(this.colorButtons);

        this.colorButtons.appendTo(this.node);

    }

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

    var node = $('<pre class="osd-item clearer">'), text = item.content;

    text = text.replace(/^\s*([0-9]{1,3})\s+/, '<span class="list-key">$1</span>&nbsp;');
    node.html(text);

    if (item.is_selected) {
        node.addClass('selected');
        this.selectedItem = node;
    }

    node.appendTo(this.osd);
};

/**
 * repaint osd
 */
Gui.Osd.View.Default.prototype.rePaint = function () {

    this.colorButtons.empty();
    this.osd.empty();
    this.selectedItem = null;
    this.addButtons();

    if (this.data.Error) {
        this.addItem(this.data.Error);
    } else if (this.data.ChannelOsd) {
        this.addItem({ "content" : this.data.ChannelOsd });
    } else {
        this.renderItems();
    }

    if (this.selectedItem) {
        this.selectedItem.get(0).scrollIntoView();
    }
};
