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
 * add render event
 */
Gui.Window.prototype.init = function () {

    var me = this;

    this.windows = [];
    this.windowNames = [];

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

    /*
    if (payload.dataSource) {
        payload.data = VDRest.app.getModule(
            payload.dataSource.module
        ).getController(
            payload.dataSource.className,
            payload.dataSource.keyInCache
        ).getData()
    }
    */

    controller = module.getController(payload.type, payload.data);

    if (!(controller.singleton && controller.view.isRendered)) {

        if (!controller.noHistory) {

            suffix += payload.hashSuffix ? payload.hashSuffix : '';

            if (!payload.omitPushHistory) { // dont push new state in case of history.forward
                VDRest.app.pushHistoryState(this.name + '-' + suffix);
                /*
                VDRest.app.addHistoryStateInfo({
                    "fireEvent" : {
                        "type" : "window.request",
                        "payload" : {
                            "module" : module.namespace + '.' + module.name,
                            "type" : payload.type,
                            "dataSource" : {
                                "module" : module.namespace + '.' + module.name,
                                "className" : controller._class,
                                "keyInCache" : controller.keyInCache != controller._class ? controller.keyInCache : undefined
                            },
                            "omitPushHistory" : true
                        }
                    }
                });
                */
            }

            this.register(controller);
        }

        controller.dispatchView();
    }
};

Gui.Window.prototype.register = function (controller) {

    this.windowNames.push(controller.keyInCache);
    this.windows.push(controller);
};

Gui.Window.prototype.popRegister = function () {

    this.windowNames.pop();
    this.windows.pop();
};

Gui.Window.prototype.getLastRegister = function () {

    return this.windows[this.windows.length - 1];
};

Gui.Window.prototype.count = function () {

    return this.windows.length;
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Window', true);