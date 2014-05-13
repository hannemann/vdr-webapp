/**
 * @class
 * @constructor
 */
Gui.Window.View.Select = function () {};

/**
 * @type {Gui.Window.View.Input}
 */
Gui.Window.View.Select.prototype = new Gui.Window.View.Input();

/**
 * @type {boolean}
 */
Gui.Window.View.Select.prototype.isModal = true;

/**
 * decorate and render
 */
Gui.Window.View.Select.prototype.render = function () {

    this.header = $('<div class="header">').appendTo(this.body);

    this.valuesWrapper = $('<div class="wrapper">').appendTo(this.body);

    this.setHeader().addClasses().addValues().addButtons();

    this.node.addClass('select');

    Gui.Window.View.Abstract.prototype.render.call(this);
};

/**
 * add header text
 * @returns {Gui.Window.View.Select}
 */
Gui.Window.View.Select.prototype.setHeader = function () {

    this.header.text(this.data.label);

    return this;
};

/**
 * add selectable values
 * @returns {Gui.Window.View.Select}
 */
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

/**
 * prepare valu object
 * @param value
 */
Gui.Window.View.Select.prototype.prepareValue = function (value) {

    var name = this.data.gui.attr('name'), html = '';

    value.dom = $('<label>');

    if (value.image) {
        html += '<img src="' + value.image + '">';
    }

    html += value.label;

    value.dom.html(html);

    value.gui = $('<input name="' + name + '" value="' + value.label + '" type="radio">')
        .appendTo(value.dom);

    if (value.selected || this.data.gui.val() === value.label || VDRest.config.getItem(name) === value.value) {

        value.gui.prop('checked', true);
    }
};
