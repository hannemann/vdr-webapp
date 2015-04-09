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
 * context menu definition
 * @type {{}}
 */
Gui.Timer.prototype.contextMenu = {

    "Refresh": {
        "labels": {
            "on": VDRest.app.translate("Refresh")
        },
        "state": "on",
        "scope": 'Gui.Timer',
        "fn": function () {

            this.refresh();
        }
    }
};

/**
 * dispatch default view
 */
Gui.Timer.prototype.dispatch = function () {

    this.store = this.getStore();
    this.getController('List').dispatchView();
};

Gui.Timer.prototype.getStore = function () {

    if (!this.store) {
        this.store = VDRest.app.getModule('VDRest.Timer');
    }
    return this.store;
};

/**
 * dispatch default view
 */
Gui.Timer.prototype.destruct = function () {

    this.getController('List').destructView();
    this.cache.flush();
};

/**
 * refresh
 */
Gui.Timer.prototype.refresh = function () {

    this.getView('List').node.empty();

    this.getStore().getModel('List').flushCollection();
    delete this.store.cache.store.Model['List.Timer'];
    delete this.cache.store.Controller['List.Timer'];
    delete this.cache.store.View['List.Timer'];
    delete this.cache.store.ViewModel['List.Timer'];
    this.dispatch();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Timer', true);