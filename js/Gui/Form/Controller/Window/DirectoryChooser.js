/**
 * @class
 * @constructor
 */
Gui.Form.Controller.Window.DirectoryChooser = function () {};

/**
 * @type {Gui.Form.Controller.Window.Select}
 */
Gui.Form.Controller.Window.DirectoryChooser.prototype = new Gui.Form.Controller.Window.Select();

/**
 * initialize view
 */
Gui.Form.Controller.Window.DirectoryChooser.prototype.init = function () {

    this.eventPrefix = 'window.directorychooser';

    this.view = this.module.getView('Window.DirectoryChooser', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * add event listeners
 */
Gui.Form.Controller.Window.DirectoryChooser.prototype.addObserver = function () {

    var me = this;

    Gui.Form.Controller.Window.Select.prototype.addObserver.call(this);

    this.view.node.find('label').each (function () {

        var node = $(this);

        node.on('mouseup', function (e) {

            me.vibrate();

            e.stopPropagation();

            me.view.node.find('label').removeClass('active');

            if (node.find('label').length > 0) {

                $(this).toggleClass('expand');
            }
            $(this).addClass('active');
        })
    });
};

/**
 * remove event listeners
 */
Gui.Form.Controller.Window.DirectoryChooser.prototype.removeObserver = function () {

    Gui.Form.Controller.Window.Select.prototype.removeObserver.call(this);

    this.view.node.find('label').each(function () {

        var node = $(this);

        node.off('mouseup');
    });
};
