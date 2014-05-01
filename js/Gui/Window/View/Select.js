
Gui.Window.View.Select = function () {};

/**
 * @type {Gui.Window.View.Input}
 */
Gui.Window.View.Select.prototype = new Gui.Window.View.Input();

Gui.Window.View.Select.prototype.isModal = true;

Gui.Window.View.Select.prototype.render = function () {

    this.header = $('<div class="header">').appendTo(this.body);

    this.valuesWrapper = $('<div class="wrapper">').appendTo(this.body);

    this.setHeader().addClasses().addValues().addButtons();

    this.node.addClass('select');

    Gui.Window.View.Abstract.prototype.render.call(this);
};

Gui.Window.View.Select.prototype.setHeader = function () {

    this.header.text(this.data.label);

    return this;
};

Gui.Window.View.Select.prototype.addValues = function () {

    var i, values = this.data.values;

    if ("function" === typeof values) {

        values = values();
    }

    for (i in values) {

        if (values.hasOwnProperty(i)) {

            this.prepareValue(values[i]);

            values[i].dom.appendTo(this.valuesWrapper);
        }
    }

    return this;
};

Gui.Window.View.Select.prototype.prepareValue = function (value) {

    var name = this.data.gui.attr('name');

    value.dom = $('<label>').text(value.label);

    value.gui = $('<input name="' + name + '" value="' + value.label + '" type="radio">')
        .appendTo(value.dom);

    if (value.selected || VDRest.config.getItem(name) === value.value) {

        value.gui.prop('checked', true);
    }
};