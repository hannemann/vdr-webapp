/**
 * Menubar Module
 * @constructor
 */
Gui.Menubar = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Menubar.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Menubar.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Menubar.prototype.name = 'Menubar';

/**
 * add render event
 */
Gui.Menubar.prototype.init = function () {

    var me = this;

    VDRest.Abstract.Module.prototype.init.call(this);

    $(document).one('dispatch.before', function () {
        me.dispatch();
    });
};

/**
 * dispatch default view
 */
Gui.Menubar.prototype.dispatch = function () {

    this.getController('Default').dispatchView();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Menubar', true);
