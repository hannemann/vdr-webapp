/**
 * Remote frontend Module
 * @constructor
 */
Gui.Database = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Database.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Database.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Database.prototype.name = 'Database';

/**
 * show up in drawer
 * @type {string}
 */
Gui.Database.prototype.inDrawer = true;

/**
 * start page capable
 * @type {string}
 */
Gui.Database.prototype.startPage = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Database.prototype.headline = 'Your Media';

/**
 * context menu definition
 * @type {{}}
 */
Gui.Database.prototype.contextMenu = {

    "sync": {
        "labels": {
            "on": 'Synchronize',
            "off": 'Synchronize'
        },
        "state": "on",
        "scope": 'Gui.Database',
        "fn": function () {
            VDRest.app.getModule('VDRest.Database').getController('Sync').synchronize();
        }
    }
};

/**
 * dispatch default view
 */
Gui.Database.prototype.dispatch = function () {

    this.backend = VDRest.app.getModule('VDRest.Database');

    this.getController('Default').dispatchView();
};

/**
 * destroy remote
 */
Gui.Database.prototype.destruct = function () {

    this.getController('Default').destructView();
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Database', true);
