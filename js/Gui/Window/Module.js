/**
 * Window Module
 * @constructor
 */
Gui.Window = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Window.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Window.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Window.prototype.name = 'Window';

/**
 * store video player if exists
 * @type {boolean|Gui.Window.Controller.VideoPlayer}
 */
Gui.Window.prototype.videoPlayer = false;

/**
 * determine if vdeoplayer winow exists
 * @returns {boolean}
 */
Gui.Window.prototype.hasVideoPlayer = function () {

    return !!this.videoPlayer;
};

/**
 * store instance of video player
 * @param {Gui.Window.Controller.VideoPlayer} controller
 */
Gui.Window.prototype.setVideoPlayer = function (controller) {

    if (controller && controller instanceof Gui.Window.Controller.VideoPlayer) {
        this.videoPlayer = controller;
    } else {
        this.videoPlayer = false;
    }

};

Gui.Window.prototype.getVideoPlayer = function () {

    return this.videoPlayer;
};

/**
 * delete videoplayer
 */
Gui.Window.prototype.unsetVideoPlayer = function () {
    this.videoPlayer = false;
};
/**
 * add render event
 */
Gui.Window.prototype.init = function () {

    var me = this;

    this.windows = [];

    VDRest.Abstract.Module.prototype.init.call(this);

    $document.on('window.request', function (e) {

        me.dispatch(e.payload);
    });
};

/**
 * dispatch requested type
 */
Gui.Window.prototype.dispatch = function (payload) {

    var module, suffix = payload.type, controller;

    module = payload.module || this;

    if ("string" === typeof module) {
        module = VDRest.app.getModule(module);
    }

    controller = module.getController(payload.type, payload.data);

    if (!(controller.singleton && controller.view.isRendered)) {

        if (!controller.noHistory) {
            suffix += payload.hashSuffix ? payload.hashSuffix : '';

            VDRest.app.saveHistoryState(
                controller.eventPrefix + '.hashChanged',
                controller.destructView.bind(controller),
                this.name + '-' + suffix
            );
        }

        controller.dispatchView();

        this.register(controller);
    }
};

Gui.Window.prototype.register = function (controller) {

    this.windows.push(controller);
};

Gui.Window.prototype.popRegister = function () {

    this.windows.pop();
};

Gui.Window.prototype.count = function () {

    return this.windows.length;
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Window', true);