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

    var i, values = VDRest.app.getModule('VDRest.Recordings').getHelper().getDirTree(), root = {
        "hasChildren" : true
    };

    // create root folder
    this.prepareValue('', root);
    root.dom.prepend(VDRest.app.translate('Root'));
    root.dom.addClass('default-expanded').appendTo(this.valuesWrapper);

    for (i in values) {

        if (values.hasOwnProperty(i)) {

            this.addRecursive(i, values[i], root.childWrapper);
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

        if (i === 'dom' || i === 'gui' || i === 'hasChildren' || i === 'fullPath' || i === 'childWrapper') continue;

        if (directory.hasOwnProperty(i)) {

            this.addRecursive(
                i,
                directory[i],
                (directory.hasChildren ? directory.childWrapper : directory.dom)
            );
        }
    }

    directory.dom.appendTo(parentNode);
    if (directory.dom.hasClass('active') || directory.dom.hasClass('expand')) {
        directory.dom.parents('label.directory').addClass('expand');
    }
};

/**
 * prepare value object
 * @param label
 * @param value
 */
Gui.Window.View.DirectoryChooser.prototype.prepareValue = function (label, value) {

    var name = this.data.gui.attr('name');

    value.dom = $('<label>').addClass('directory');

    value.gui = $('<input name="' + name + '" value="' + label + '" type="radio">')
        .appendTo(value.dom);

    $('<span>').addClass('text').html(label).appendTo(value.dom);

    if (
        value.selected ||
        this.data.gui.val() === label ||
        this.data.gui.val() === value.fullPath ||
        VDRest.config.getItem(name) === value.value
    ) {

        value.gui.prop('checked', true);
        value.dom.addClass('active');
        value.dom.parents('label.directory').addClass('expand');
    }

    if (value.hasChildren) {
        value.childWrapper = $('<span class="child-wrapper">').appendTo(value.dom);
    }
};
