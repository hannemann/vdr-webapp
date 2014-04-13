/**
 * Settings Module
 * @constructor
 */
Gui.Config = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Config.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Config.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Config.prototype.name = 'Config';

/**
 * add render event
 */
Gui.Config.prototype.init = function () {

    var me = this;

    VDRest.Abstract.Module.prototype.init.call(this);

    $(document).on('Config.request', function (e) {

        me.dispatch(e.object);
    });
};

/**
 * dispatch requested type
 */
Gui.Config.prototype.dispatch = function () {

    VDRest.app.setLocationHash(this.name);
    this.store = VDRest.config;
    this.getController('Settings').dispatchView();
};

/**
 * destroy module
 */
Gui.Config.prototype.destruct = function () {

    this.getController('Settings').destructView();
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Config', true);