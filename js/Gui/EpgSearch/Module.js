/**
 * Epg Module
 * @constructor
 */
Gui.EpgSearch = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.EpgSearch.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.EpgSearch.prototype.namespace = 'Gui';

/**
 * Module name
 * @type {string}
 */
Gui.EpgSearch.prototype.name = 'EpgSearch';

/**
 * Module depends on vdr plugin epgsearch
 * @type {string}
 */
Gui.EpgSearch.prototype.pluginDependency = 'epgsearch';

/**
 * show up in drawer
 * @type {string}
 */
Gui.EpgSearch.prototype.inDrawer = true;

/**
 * headline in menu bar
 * @type {string}
 */
Gui.EpgSearch.prototype.headline = 'EPG Search';

/**
 * context menu definition
 * @type {{}}
 */
Gui.EpgSearch.prototype.contextMenu = {

    "save_overview": {
        "labels": {
            "on": VDRest.app.translate("Save as Overview Template")
        },
        "state": "on",
        "scope": 'Gui.EpgSearch',
        "fn": function () {

            this.saveOverviewTemplate();
        }
    },
    "edit_overview": {
        "labels": {
            "on": VDRest.app.translate("Edit Overview Template")
        },
        "state": "on",
        "scope": 'Gui.EpgSearch',
        "fn": function () {

            this.loadOverviewTemplate();
        }
    }
};

/**
 * dispatch default view
 */
Gui.EpgSearch.prototype.dispatch = function (search) {

    this.getController('Search', {"query":search}).dispatchView();
};

/**
 * flush cache, destruct view
 */
Gui.EpgSearch.prototype.destruct = function () {

    this.getController('Search').destructView(true);
    this.cache.flush();
    this.deleteSearchTimerModel();
};

/**
 * delete dummy instance of searchTimerModel
 */
Gui.EpgSearch.prototype.deleteSearchTimerModel = function () {

    delete VDRest.app.getModule('VDRest.SearchTimer').cache.store.Model['List.SearchTimer'][-1];
};

/**
 * save current form data as overview search template
 */
Gui.EpgSearch.prototype.saveOverviewTemplate = function () {

    var fields = VDRest.app.getModule('Gui.Form').getController('Abstract').Search.data.fields,
        model = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer', {"id" : -1}),
        template = model.copyFromForm(fields);

    VDRest.app.getModule('VDRest.Epg').getModel('Overview.Template').save(template);
};

/**
 * load overview template
 */
Gui.EpgSearch.prototype.loadOverviewTemplate = function () {

    var model, data;
    this.deleteSearchTimerModel();

    model = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer',{"id" : -1});

    data = VDRest.app.getModule('VDRest.Epg').getModel('Overview.Template').getTemplate();
    data.advanced = true;

    model.data = data;

    this.getController('Search').reInitForm(model);
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.EpgSearch', true);