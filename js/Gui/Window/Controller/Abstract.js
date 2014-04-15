/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Abstract = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Window.Controller.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * init parentView
 */
Gui.Window.Controller.Abstract.prototype.init = function () {

    VDRest.app.addDestroyer(this.eventPrefix + '.hashChanged', $.proxy(this.destructView, this));

    this.view.setParentView({
        "node" :$('body')
    });
};

/**
 * init parentView
 */
Gui.Window.Controller.Abstract.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    if (this.view.getTabConfig) {

        $.event.trigger({
            "type" : "tabs.request",
            "tabConfig" : this.view.getTabConfig()
        });
    }
};

/**
 * add event handler
 * add destroyer to VDRest.app
 */
Gui.Window.Controller.Abstract.prototype.addObserver = function () {

    if (this.view.closeButton) {

        this.view.closeButton.one('click', function () {

            history.back();
        });
    }
};

Gui.Window.Controller.Abstract.prototype.destructView = function () {

    VDRest.Abstract.Controller.prototype.destructView.call(this);
    this.module.cache.flushByClassKey(this);
};
