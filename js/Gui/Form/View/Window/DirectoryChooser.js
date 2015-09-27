/**
 * @class
 * @constructor
 */
Gui.Form.View.Window.DirectoryChooser = function () {};

/**
 * @type {Gui.Form.View.Window.Select}
 */
Gui.Form.View.Window.DirectoryChooser.prototype = new Gui.Form.View.Window.Select();

/**
 * decorate and render
 */
Gui.Form.View.Window.DirectoryChooser.prototype.render = function () {

    Gui.Form.View.Window.Select.prototype.render.call(this);

    this.node.addClass('directory-chooser');
};

/**
 * add selectable values
 * @returns {Gui.Form.View.Window.DirectoryChooser}
 */
Gui.Form.View.Window.DirectoryChooser.prototype.addValues = function () {

    var i, values = VDRest.app.getModule('VDRest.Recordings').getHelper().getDirTree(), root = {
        "hasChildren" : true
    };

    // create root folder
    this.prepareValue('/', root);
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
Gui.Form.View.Window.DirectoryChooser.prototype.addRecursive = function (label, directory, parentNode) {

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
Gui.Form.View.Window.DirectoryChooser.prototype.prepareValue = function (label, value) {

    var name = this.data.gui.attr('name');

    value.dom = $('<label class="directory clearer">');

    value.gui = $('<input name="' + name + '" value="' + label + '" type="radio">')
        .appendTo(value.dom);

    $('<span>').addClass('text').html(label).appendTo(value.dom);

    if (
        value.selected ||
        this.data.gui.val() === value.fullPath ||
        VDRest.config.getItem(name) === value.value ||
        ( '/' === label && '' === this.data.gui.val() )
    ) {

        value.gui.prop('checked', true);
        value.dom.addClass('active');
        value.dom.parents('label.directory').addClass('expand');
    }

    value.dom.append('<span class="fancy-radio"><span>✘</span></span>');

    if (value.hasChildren) {
        value.childWrapper = $('<span class="child-wrapper">').appendTo(value.dom);
    }
};
