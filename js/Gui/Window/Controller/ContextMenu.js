/**
 * @class
 * @constructor
 * @var {object} data
 */
Gui.Window.Controller.ContextMenu = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.ContextMenu.prototype = new Gui.Window.Controller.Abstract();

/**
 * initialize view
 */
Gui.Window.Controller.ContextMenu.prototype.init = function () {

    this.eventPrefix = 'window.contextmenu';

    this.view = this.module.getView('ContextMenu', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Window.Controller.ContextMenu.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Window.Controller.ContextMenu.prototype.addObserver = function () {

    var i,
        config = VDRest.app.getModule('Gui.Config');

    for (i in this.data) {

        if (this.data.hasOwnProperty(i) && i !== 'isDispatched') {

            this.data[i].button.one(
                'mousedown', $.proxy(
                    this.handleButtonClick,
                    this,
                    this.data[i].fn,
                    VDRest.app.getModule(this.data[i].scope)
                )
            )
        }
    }

    if (VDRest.app.getCurrent() !== config.namespace + '.' + config.name) {

        this.view.node.find('.config-button')
            .one('mousedown', $.proxy(this.handleConfig, this));
    }

    this.view.node.find('.reload-button')
        .one('mousedown', $.proxy(this.handleReload, this));

    this.view.modalOverlay.one('click', $.proxy(function () {

        if (!this.skipBack) {
            history.back();
        }
        this.skipBack = undefined;
    }, this));
};

/**
 * call method defined as callback
 */
Gui.Window.Controller.ContextMenu.prototype.handleButtonClick = function (callback, scope) {

    this.skipBack = true;

    history.back();

    callback.call(scope);
};

/**
 * call method defined as callback
 */
Gui.Window.Controller.ContextMenu.prototype.handleConfig = function (e) {

    e.stopPropagation();

    history.back();

    setTimeout(function () {
        VDRest.app.dispatch('Gui.Config');
    }, 100);
};

/**
 * reload page
 */
Gui.Window.Controller.ContextMenu.prototype.handleReload = function () {

    setTimeout(function () {
        location.reload();
    }, 100);
};

/**
 * reload page
 */
Gui.Window.Controller.ContextMenu.prototype.destructView = function () {

    var me = this;
    // apply animation
    this.view.node.addClass('remove');
    // remove on animation end
    this.view.node.one('webkitAnimationEnd', function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};