/**
 * @class
 * @constructor
 */
Gui.Window.View.ContextMenu = function () {};

/**
 * @type {Gui.Window.View.Abstract}
 */
Gui.Window.View.ContextMenu.prototype = new Gui.Window.View.Abstract();

/**
 * @type {boolean}
 */
Gui.Window.View.ContextMenu.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.ContextMenu.prototype.isModalTransparent = true;

/**
 * initialize node
 */
Gui.Window.View.ContextMenu.prototype.init = function () {

    this.node = $('<div class="context-menu shadow">');
};

/**
 * render
 */
Gui.Window.View.ContextMenu.prototype.render = function () {

    this.addClasses().addButtons();

    Gui.Window.View.Abstract.prototype.render.call(this);
};

Gui.Window.View.ContextMenu.prototype.addClasses = function () {

    return this;

};

/**
 * add buttons
 * @returns {Gui.Window.View.ContextMenu}
 */
Gui.Window.View.ContextMenu.prototype.addButtons = function () {

    var i, label;

    for (i in this.data) {

        if (this.data.hasOwnProperty(i) && i !== 'isDispatched') {

            if (!this.data[i].hidden) {

                label = this.data[i].labels[this.data[i].state];

                this.data[i].button = $('<div class="menu-button">').html(VDRest.app.translate(label))
                    .appendTo(this.node);

                if ('function' === typeof this.data[i].highlight) {
                    this.data[i].highlight.call(VDRest.app.getModule(this.data[i].scope), this.data[i]);
                }
            }
        }
    }


    if (VDRest.app.startModule === VDRest.app.getCurrent()) {

        $('<div class="config-button">').text(VDRest.app.translate('Configuration'))
            .appendTo(this.node);
    }

    //if (!VDRest.app.startedFullscreen) {
    //    $('<div class="fullscreen-button">').text(VDRest.app.translate('Go fullscreen'))
    //        .appendTo(this.node);
    //}

    $('<div class="reload-button">').text(VDRest.app.translate('Reload App'))
        .appendTo(this.node);

    if (!VDRest.helper.isTouchDevice) {
        $('<div class="resize-button">').text(VDRest.app.translate('Window 16/9'))
            .appendTo(this.node);
    }

    return this;
};

/**
 * reload page
 */
Gui.Window.View.ContextMenu.prototype.destruct = function () {

    var me = this;
    // apply animation
    this.node.addClass('remove');
    // remove on animation end
    this.node.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

            Gui.Window.View.Abstract.prototype.destruct.call(me);
    });
};

