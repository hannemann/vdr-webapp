/**
 * @class
 * @constructor
 */
Gui.Main.Controller.Default = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Main.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Main.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default');

    this.addObserver();
};

Gui.Main.Controller.Default.prototype.addObserver = function () {

    if (VDRest.helper.isTouchDevice) {
        this.view.node.on('touchstart', this.handleTouchDown.bind(this));
    }
};

Gui.Main.Controller.Default.prototype.getMenubarController = function () {

    if (!this.menubarController) {
        this.menubarController = VDRest.app.getModule('Gui.Menubar').getController('Default');
    }
    return this.menubarController;
};

/**
 * @param {jQuery.Event} e
 */
Gui.Main.Controller.Default.prototype.handleTouchDown = function (e) {

    if (
        e.originalEvent.changedTouches[0].clientX <= 10 &&
        this.getMenubarController().isStartPage() && !VDRest.app.getModule('Gui.Window').hasVideoPlayer()
    ) {

        e.stopPropagation();
        e.preventDefault();
        $.event.trigger({
            "type": 'window.request',
            "payload": {
                "type": "Drawer",
                "data": {
                    "touchstart": e.originalEvent.changedTouches[0].clientX,
                    "startTime": Date.now()
                }
            }
        });
    }
};
