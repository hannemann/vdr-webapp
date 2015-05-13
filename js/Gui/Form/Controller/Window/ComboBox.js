Gui.Form.Controller.Window.ComboBox = function () {
};

Gui.Form.Controller.Window.ComboBox.prototype = new Gui.Form.Controller.Window.Select();

/**
 * initialize view
 */
Gui.Form.Controller.Window.ComboBox.prototype.init = function () {

    this.eventPrefix = 'window.combobox';

    this.view = this.module.getView('Window.ComboBox', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * add event listeners
 */
Gui.Form.Controller.Window.ComboBox.prototype.addObserver = function () {

    var i, values = this.view.data.values;

    Gui.Form.Controller.Window.Select.prototype.addObserver.call(this);

    for (i in values) {
        if (values.hasOwnProperty(i)) {

            values[i].gui.on('change', this.checkedHandler.bind(this));
        }
    }
};

/**
 * wrap updater
 * @param {jQuery.Event} e
 */
Gui.Form.Controller.Window.ComboBox.prototype.checkedHandler = function (e) {

    this.updateText(e.target.value, e.target.checked);
};

/**
 * update text input field
 * @param {String} value
 * @param {Boolean} add
 */
Gui.Form.Controller.Window.ComboBox.prototype.updateText = function (value, add) {

    var textField = this.data.text,
        textValues = textField.val(),
        index;

    if (this.data.multiselect) {
        textValues = textValues.length > 0 ? textValues.split(this.data.text_input_seperator) : [];
        index = textValues.indexOf(value);

        if (add) {
            if (index < 0) {
                textValues.push(value);
            }
        } else {
            if (index > -1) {
                textValues.splice(index, 1);
            }
        }

        textValues.sort();
    } else {
        textValues = [value];
    }

    textField.val(textValues.join(this.data.text_input_seperator));
};
