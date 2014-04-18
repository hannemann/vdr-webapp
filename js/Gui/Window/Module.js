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

    VDRest.Abstract.Module.prototype.init.call(this);

    $(document).on('window.request', function (e) {

        me.dispatch(e.payload);
    });
};

/**
 * dispatch requested type
 */
Gui.Window.prototype.dispatch = function (payload) {

    var me = this;

    VDRest.app.observe();
    VDRest.app.setLocationHash(this.name + '-' + payload.type + payload.hashSuffix);

    me.getController(payload.type, payload.data).dispatchView();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Window', true);