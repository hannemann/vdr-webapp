/**
 * Timer Module
 * @constructor
 */
Gui.Timer = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Timer.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Timer.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.Timer.prototype.name = 'Timer';

/**
 * show up in drawer
 * @type {string}
 */
Gui.Timer.prototype.inDrawer = true;

/**
 * start page capable
 * @type {string}
 */
Gui.Timer.prototype.startPage = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Timer.prototype.headline = 'Timer';

/**
 * dispatch default view
 */
Gui.Timer.prototype.dispatch = function () {

    this.store = VDRest.app.getModule('VDRest.Timer');
    this.getController('List').dispatchView();
};

/**
 * dispatch default view
 */
Gui.Timer.prototype.destruct = function () {

    this.getController('List').destructView();
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Timer', true);