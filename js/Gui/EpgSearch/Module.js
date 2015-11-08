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

    "load_template": {
        "labels" : {
            "on" : VDRest.app.translate('Choose Template')
        },
        "state" : "on",
        "scope" : "Gui.EpgSearch",
        "fn" : function () {
            this.getTemplateSelect();
        }
    },
    "save_template": {
        "labels" : {
            "on" : VDRest.app.translate('Save as Template')
        },
        "state" : "on",
        "scope" : "Gui.EpgSearch",
        "fn" : function () {
            this.saveAsTemplate();
        }
    },
    "TemplateDelete" : {
        "labels" : {
            "on" : VDRest.app.translate("Delete Templates")
        },
        "state" : "on",
        "scope" : "Gui.EpgSearch",
        "fn" : function () {

            this.selectDeleteTemplates();
        }
    }



    /*,
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
    */
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
    this.deleteSearchTimerDummy();
};

/**
 * delete dummy instance of searchTimerModel
 */
Gui.EpgSearch.prototype.deleteSearchTimerDummy = function () {

    delete VDRest.app.getModule('VDRest.SearchTimer').cache.store.Model['List.SearchTimer'][-1];
};

/**
 * save current form data as search template
 */
Gui.EpgSearch.prototype.saveAsTemplate = function () {

    var fields = VDRest.app.getModule('Gui.Form').getController('Abstract').Search.data.fields,
        model = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer', {"id" : -1}),
        template = model.copyFromForm(fields),
        data = {
            "type": "string",
            "dom": $('<label class="clearer text">'),
            "value" : template.search
        };

    $('<span>').text(VDRest.app.translate('Enter name')).appendTo(data.dom);

    data.gui = $('<input type="text" name="template-name">')
        .appendTo(data.dom);
    data.gui.val(data.value);

    data.gui.one('change', function (e) {
        VDRest.app.getModule('VDRest.Epg').getModel('Search.Templates').saveTemplate(template, e.target.value);
    }.bind(this));

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "module" : VDRest.app.getModule('Gui.Form'),
            "type" : "Window.Input",
            "data" : data
        }
    });
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
 * retrieve template select window
 */
Gui.EpgSearch.prototype.getTemplateSelect = function () {

    var data = this.getHelper('Templates').getSingleSelectWithNone('Choose Template');

    data.gui.one('change', this.loadTemplate.bind(this));

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Window.Select",
            "module" : VDRest.app.getModule('Gui.Form'),
            "data" : data
        }
    });
};

/**
 * load overview template
 */
Gui.EpgSearch.prototype.loadTemplate = function (e) {

    var model, data;
    this.deleteSearchTimerDummy();

    model = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer',{"id" : -1});

    data = VDRest.app.getModule('VDRest.Epg').getModel('Search.Templates').getTemplate(e.target.value);
    if (data) {
        model.data = data;
        this.getController('Search').reInitForm(model);
    }
};

/**
 * load overview template
 */
Gui.EpgSearch.prototype.loadOverviewTemplate = function () {

    var model, data;
    this.deleteSearchTimerDummy();

    model = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer',{"id" : -1});

    data = VDRest.app.getModule('VDRest.Epg').getModel('Overview.Template').getTemplate();
    if (data) {
        data.advanced = true;
        model.data = data;
        this.getController('Search').reInitForm(model);
    }
};

/**
 * get multi select
 */
Gui.EpgSearch.prototype.selectDeleteTemplates = function () {

    var data = this.getHelper('Templates').getMultiSelect('Choose Templates');

    data.gui.one('change', this.doDeleteTemplates.bind(this));

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "module" : VDRest.app.getModule('Gui.Form'),
            "type" : "Window.Select",
            "data" : data
        }
    });

};

/**
 * delete templates
 * @param {jQuery.Event} e
 */
Gui.EpgSearch.prototype.doDeleteTemplates = function (e) {

    var names = e.target.value.split(', ');

    this.getHelper('Templates').deleteTemplates(names);
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.EpgSearch', true);