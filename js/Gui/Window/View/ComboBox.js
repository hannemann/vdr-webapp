/**
 * @constructor
 */
Gui.Window.View.ComboBox = function () {
};

/**
 * @type {Gui.Window.Controller.Select}
 */
Gui.Window.View.ComboBox.prototype = new Gui.Window.View.Select();

/**
 * add header text and input field
 * @returns {Gui.Window.View.ComboBox}
 */
Gui.Window.View.ComboBox.prototype.setHeader = function () {

    Gui.Window.View.Select.prototype.setHeader.call(this);

    this.header.append(this.getInputField());

    return this;
};

/**
 * build input field
 * @return {jQuery}
 */
Gui.Window.View.ComboBox.prototype.getInputField = function () {

    var l = $('<label>'), id = this.data.gui.attr('name') + '_text';

    this.data.text = $('<input>');

    l.addClass('clearer text').attr('id', id);

    this.data.text.attr('name', id)
        .attr('type', 'text')
        .val(this.data.gui.val())
        .appendTo(l);

    return l;
};
