/**
 * SearchTimer Module
 * @constructor
 */
Gui.SearchTimer = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.SearchTimer.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.SearchTimer.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.SearchTimer.prototype.name = 'SearchTimer';

/**
 * Module depends on vdr plugin epgsearch
 * @type {string}
 */
Gui.SearchTimer.prototype.pluginDependency = 'epgsearch';

/**
 * show up in drawer
 * @type {string}
 */
Gui.SearchTimer.prototype.inDrawer = true;

/**
 * start page capable
 * @type {string}
 */
Gui.SearchTimer.prototype.startPage = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.SearchTimer.prototype.headline = 'Searchtimer';

/**
 * context menu definition
 * @type {{}}
 */
Gui.SearchTimer.prototype.contextMenu = {

    "add" : {
        "labels" : {
            "on" : 'New',
            "off" : 'New'
        },
        "state" : "on",
        "scope" : 'Gui.SearchTimer',
        "fn" : function () {

            $.event.trigger({
                "type" : "window.request",
                "payload" : {
                    "type" : "SearchTimer",
                    "data" : {
                        "is_new" : true,
                        "resource" : VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer', {"id":""})
                    }
                }
            })
        }
    }
};

/**
 * dispatch default view
 */
Gui.SearchTimer.prototype.dispatch = function () {

    this.store = VDRest.app.getModule('VDRest.SearchTimer');
    this.getController('List').dispatchView();
};

/**
 * destroy view
 */
Gui.SearchTimer.prototype.destruct = function () {

    this.getController('List').destructView(true);
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.SearchTimer', true);