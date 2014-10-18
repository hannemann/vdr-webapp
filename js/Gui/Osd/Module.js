/**
 * OSD Module
 * @constructor
 */
Gui.Osd = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Osd.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Osd.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Osd.prototype.name = 'Osd';

/**
 * show up in drawer
 * @type {string}
 */
Gui.Osd.prototype.inDrawer = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Osd.prototype.headline = 'OSD';

/**
 * dispatch default view
 */
Gui.Osd.prototype.dispatch = function () {

    this.getController('Default').dispatchView();
};

/**
 * dispatch default view
 */
Gui.Osd.prototype.destruct = function () {

    this.getController('Default').destructView();
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Osd', true);
