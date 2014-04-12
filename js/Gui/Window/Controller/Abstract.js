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

    this.view.setParentView({
        "node" :$('body')
    });
};

/**
 * add event handler
 * add destroyer to VDRest.app
 */
Gui.Window.Controller.Abstract.prototype.addObserver = function () {

    if (this.view.closeButton) {

        this.view.closeButton.on('click', function () {

            history.back();
        });
    }

    VDRest.app.addDestroyer(this.eventPrefix + '.hashChanged', $.proxy(this.view.destruct, this.view));
};
