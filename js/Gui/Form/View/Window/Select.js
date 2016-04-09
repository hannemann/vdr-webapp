/**
 * @class
 * @constructor
 * @property {{}|Function} values
 */
Gui.Form.View.Window.Select = function () {};

/**
 * @type {Gui.Form.View.Window.Input}
 */
Gui.Form.View.Window.Select.prototype = new Gui.Form.View.Window.Input();

/**
 * @type {boolean}
 */
Gui.Form.View.Window.Select.prototype.isModal = true;

/**
 * decorate and render
 */
Gui.Form.View.Window.Select.prototype.render = function () {

    this.header = $('<div class="header">').appendTo(this.body);

    this.valuesWrapper = $('<div class="wrapper">').appendTo(this.body);

    this.setHeader().addClasses().addValues().addButtons();

    this.node.addClass('select');

    Gui.Window.View.Abstract.prototype.render.call(this);
};

/**
 * add header text
 * @returns {Gui.Form.View.Window.Select}
 */
Gui.Form.View.Window.Select.prototype.setHeader = function () {

    this.header.text(VDRest.app.translate(this.data.label));

    return this;
};

/**
 * add selectable values
 * @returns {Gui.Form.View.Window.Select}
 */
Gui.Form.View.Window.Select.prototype.addValues = function () {

    var i;
    this.values = this.data.values;

    if ("function" === typeof this.values) {

        this.values = this.values();
    }

    for (i in this.values) {

        if (this.values.hasOwnProperty(i)) {

            this.prepareValue(this.values[i]);

            this.values[i].dom.appendTo(this.valuesWrapper);
        }
    }

    return this;
};

/**
 * prepare value object
 * @param value
 */
Gui.Form.View.Window.Select.prototype.prepareValue = function (value) {

    var name = this.data.gui.attr('name'),html = '', type, label;

    type = this.data.multiselect ? 'checkbox' : 'radio';

    value.dom = $('<label class="clearer">');

    if (value.className) {
        value.dom.addClass(value.className);
    }

    if (value.image) {
        html += '<img src="' + value.image + '">';
    }

    if ("undefined" === typeof  value.translate || value.translate === true) {
        label = VDRest.app.translate(value.label);
    } else {
        label = value.label;
    }

    html += '<em class="text">' + label + '</em>';

    value.dom.html(html);

    value.gui = $('<input name="' + name + '" value="' + value.label + '" type="' + type + '">')
        .appendTo(value.dom);

    if ('checkbox' === type) {

        value.dom.append('<span class="fancy-checkbox"><span>✔</span></span>');

    } else {

        value.dom.append('<span class="fancy-radio"><span>✘</span></span>');
    }

    if (value.selected || this.data.gui.val() === value.label || VDRest.config.getItem(name) === value.value) {

        value.gui.prop('checked', true);
        value.dom.addClass('selected');
    }

    if (value.disabled) {

        value.gui.attr('disabled', true);
        value.dom.addClass('disabled');
    }
};

/**
 * destruct
 */
Gui.Form.View.Window.Select.prototype.destruct = function () {

    var i;

    for (i in this.values) {
        if (this.values.hasOwnProperty(i)) {
            this.values[i].gui.off('change');
        }
    }

    Gui.Window.View.Abstract.prototype.destruct.call(this);
};
