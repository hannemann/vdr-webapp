/**
 * Recordings Module
 * @constructor
 */
Gui.Recordings = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Recordings.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Recordings.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.Recordings.prototype.name = 'Recordings';

/**
 * show up in drawer
 * @type {string}
 */
Gui.Recordings.prototype.inDrawer = true;

/**
 * start page capable
 * @type {string}
 */
Gui.Recordings.prototype.startPage = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Recordings.prototype.headline = 'Recordings';

/**
 * context menu definition
 * @type {{}}
 */
Gui.Recordings.prototype.contextMenu = {

    "sortStartTime" : {
        "labels" : {
            "on" : 'Date &#8595;',
            "off" : 'Date &#8593;'
        },
        "state" : "on",
        "scope" : 'Gui.Recordings',
        "fn" : function () {

            var view = this.getView('List');
            if ("on" === this.contextMenu.sortStartTime.state) {

                this.contextMenu.sortStartTime.state = "off";
                view.setSorting('dateDesc');
                this.getController('List').reRender();

            } else {

                this.contextMenu.sortStartTime.state = "on";
                view.setSorting('dateAsc');
                this.getController('List').reRender();
            }
        },
        "highlight" : function (bObj) {
            if (0 === this.getView('List').sorting.indexOf('date')) {
                bObj.button.addClass('active');
            } else {
                bObj.button.removeClass('active');
            }
        }
    },

    "sortAlpha" : {
        "labels" : {
            "on" : 'Name &#8595;',
            "off" : 'Name &#8593;'
        },
        "state" : "on",
        "scope" : 'Gui.Recordings',
        "fn" : function () {

            var view = this.getView('List');
            view.setSorting('alnum');
            if ("on" === this.contextMenu.sortAlpha.state) {

                this.contextMenu.sortAlpha.state = "off";
                view.setSorting('nameDesc');
                this.getController('List').reRender();

            } else {

                this.contextMenu.sortAlpha.state = "on";
                view.setSorting('nameAsc');
                this.getController('List').reRender();
            }
        },
        "highlight" : function (bObj) {
            if (0 === this.getView('List').sorting.indexOf('name')) {
                bObj.button.addClass('active');
            } else {
                bObj.button.removeClass('active');
            }
        }
    }
};

/**
 * dispatch default view
 */
Gui.Recordings.prototype.dispatch = function () {

    this.store = VDRest.app.getModule('VDRest.Recordings');
    this.getController('List').dispatchView();
};

/**
 * dispatch default view
 */
Gui.Recordings.prototype.destruct = function () {

    this.getController('List').destructView();
};

/**
 * refresh
 */
Gui.Recordings.prototype.refresh = function () {

    VDRest.app.getModule('Gui.Viewport').getView('Default').node.empty();
    VDRest.app.getModule('Gui.Window').cache.invalidateClasses('Directory');
    this.store.getModel('List').flushCollection();
    this.store.cache.flush();
    this.cache.flush();
    this.dispatch();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Recordings', true);