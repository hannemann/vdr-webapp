/**
 * Menubar Module
 * @constructor
 */
Gui.Viewport = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Viewport.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Viewport.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Viewport.prototype.name = 'Viewport';

/**
 * add render event
 */
Gui.Viewport.prototype.init = function () {

    var me = this;

    VDRest.Abstract.Module.prototype.init.call(this);

    $(document).one('menubar.init', function () {
        me.dispatch();
    });
};

/**
 * dispatch default view
 */
Gui.Viewport.prototype.dispatch = function () {

    this.getController('Default').dispatchView();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Viewport', true);