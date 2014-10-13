/**
 * @class
 * @constructor
 */
Gui.Window.Controller.DirectoryChooser = function () {};

/**
 * @type {Gui.Window.Controller.Select}
 */
Gui.Window.Controller.DirectoryChooser.prototype = new Gui.Window.Controller.Select();

/**
 * initialize view
 */
Gui.Window.Controller.DirectoryChooser.prototype.init = function () {

    this.eventPrefix = 'window.directorychooser';

    this.view = this.module.getView('DirectoryChooser', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * initialize view
 */
Gui.Window.Controller.DirectoryChooser.prototype.addObserver = function () {

    var me = this;

    Gui.Window.Controller.Select.prototype.addObserver.call(this);

    this.view.node.find('label').each (function () {

        var node = $(this);

        $(this).on('mouseup', function (e) {

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
