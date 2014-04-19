
Gui.Window.View.Drawer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Drawer.prototype = new Gui.Window.View.Abstract();

Gui.Window.View.Drawer.prototype.isModalViewport = true;

Gui.Window.View.Drawer.prototype.render = function () {

    this.buttons = [];

    this.addClasses();

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.triggerAnimation(true, function () {

        $.event.trigger({
            "type" : "drawer.dispatched",
            "payload" : true
        });
    });

    this.addButtons();
};

Gui.Window.View.Drawer.prototype.triggerAnimation = function (show, callback) {

    $.event.trigger('drawer.animate');

    this.node.animate({
        "left" : show ? 0 : "-50%"
    }, 'fast', callback);
};

Gui.Window.View.Drawer.prototype.addClasses = function () {

    this.node.addClass('window-drawer clearer');

    return this;
};

Gui.Window.View.Drawer.prototype.addButtons = function () {

    this.getButtons().each($.proxy(function (module, options) {

        this.buttons.push(
            $('<div class="navi-button">')
                .attr('data-module', module)
                .text(options.headline)
                .addClass(options.current ? 'current' : '')
                .appendTo(this.node)
        );

    }, this));

    return this;
};

Gui.Window.View.Drawer.prototype.destruct = function () {

    var me = this;

    this.triggerAnimation(false, function () {

        Gui.Window.View.Abstract.prototype.destruct.call(me);

        me.modalOverlay.remove();

        $.event.trigger({
            "type" : "drawer.dispatched",
            "payload" : false
        });
    });
};
