/**
 * Menubar Module
 * @constructor
 */
Gui.Main = function () {
};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Main.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Main.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Main.prototype.name = 'Main';

/**
 * add render event
 */
Gui.Main.prototype.init = function () {

    VDRest.Abstract.Module.prototype.init.call(this);

    $(document).one('menubar.init', function () {
        this.dispatch();
    }.bind(this));
};

Gui.Main.prototype.dispatch = function () {

    this.getController('Default');
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Main', true);