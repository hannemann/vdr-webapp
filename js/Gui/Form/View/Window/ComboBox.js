/**
 * @constructor
 */
Gui.Form.View.Window.ComboBox = function () {
};

/**
 * @type {Gui.Window.Controller.Select}
 */
Gui.Form.View.Window.ComboBox.prototype = new Gui.Form.View.Window.Select();

/**
 * add header text and input field
 * @returns {Gui.Form.View.Window.ComboBox}
 */
Gui.Form.View.Window.ComboBox.prototype.setHeader = function () {

    Gui.Form.View.Window.Select.prototype.setHeader.call(this);

    this.header.append(this.getInputField());

    return this;
};

/**
 * build input field
 * @return {jQuery}
 */
Gui.Form.View.Window.ComboBox.prototype.getInputField = function () {

    var l = $('<label>'), id = this.data.gui.attr('name') + '_text';

    this.data.text = $('<input>');

    l.addClass('clearer text').attr('id', id);

    this.data.text.attr('name', id)
        .attr('type', 'text')
        .val(this.data.gui.val())
        .appendTo(l);

    return l;
};
