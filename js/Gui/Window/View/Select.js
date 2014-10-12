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

    this.header.text(VDRest.app.translate(this.data.label));

    return this;
};

/**
 * add selectable values
 * @returns {Gui.Window.View.Select}
 */
Gui.Window.View.Select.prototype.addValues = function () {

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
Gui.Window.View.Select.prototype.prepareValue = function (value) {

    var name = this.data.gui.attr('name'), html = '', type;

    type = this.data.multiselect ? 'checkbox' : 'radio';

    value.dom = $('<label>');

    if (value.image) {
        html += '<img src="' + value.image + '">';
    }

    html += VDRest.app.translate(value.label);

    value.dom.html(html);

    value.gui = $('<input name="' + name + '" value="' + value.label + '" type="' + type + '">')
        .appendTo(value.dom);

    if (value.selected || this.data.gui.val() === value.label || VDRest.config.getItem(name) === value.value) {

        value.gui.prop('checked', true);
        value.dom.addClass('selected');
    }

    value.gui.on('change', function () {
        if ("radio" === type) {
            value.dom.parent('.wrapper').find('label').removeClass('selected');
        }
        VDRest.Abstract.Controller.prototype.vibrate();
        value.dom.toggleClass('selected', this.checked === true);
    });
};

/**
 * destruct
 */
Gui.Window.View.Select.prototype.destruct = function () {

    var i;

    for (i in this.values) {
        if (this.values.hasOwnProperty(i)) {
            this.values[i].gui.off('change');
        }
    }

    Gui.Window.View.Abstract.prototype.destruct.call(this);
};
