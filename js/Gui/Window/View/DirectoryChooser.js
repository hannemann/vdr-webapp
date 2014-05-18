/**
 * @class
 * @constructor
 */
Gui.Window.View.DirectoryChooser = function () {};

/**
 * @type {Gui.Window.Controller.Select}
 */
Gui.Window.View.DirectoryChooser.prototype = new Gui.Window.View.Select();

/**
 * decorate and render
 */
Gui.Window.View.DirectoryChooser.prototype.render = function () {

    Gui.Window.View.Select.prototype.render.call(this);

    this.node.addClass('directory-chooser');
};

/**
 * add selectable values
 * @returns {Gui.Window.View.DirectoryChooser}
 */
Gui.Window.View.DirectoryChooser.prototype.addValues = function () {

    var i, values = VDRest.app.getModule('VDRest.Recordings').getHelper().getDirTree();

    for (i in values) {

        if (values.hasOwnProperty(i)) {

            this.addRecursive(i, values[i], this.valuesWrapper);
        }
    }

    return this;
};

/**
 * add values recursive
 * @param {string} label
 * @param {{}} directory
 * @param {jQuery} parentNode
 */
Gui.Window.View.DirectoryChooser.prototype.addRecursive = function (label, directory, parentNode) {

    var i;

    this.prepareValue(label, directory);

    for (i in directory) {

        if (i === 'dom' || i === 'gui') continue;

        if (directory.hasOwnProperty(i)) {

            this.addRecursive(i, directory[i], directory.dom);
        }
    }

    directory.dom.appendTo(parentNode);
};

/**
 * prepare value object
 * @param label
 * @param value
 */
Gui.Window.View.DirectoryChooser.prototype.prepareValue = function (label, value) {

    var name = this.data.gui.attr('name');

    value.dom = $('<label>');

    value.dom.html(label);

    value.gui = $('<input name="' + name + '" value="' + label + '" type="radio">')
        .appendTo(value.dom);

    if (value.selected || this.data.gui.val() === label || VDRest.config.getItem(name) === value.value) {

        value.gui.prop('checked', true);
    }
};
