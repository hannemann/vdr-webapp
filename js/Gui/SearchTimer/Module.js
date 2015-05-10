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

            var sTimer, templates, m = VDRest.app.getModule('VDRest.SearchTimer');

            templates = m.getModel('Templates');

            if (templates.length > 0) {
                this.getTemplateSelect(templates.getData());
            } else {

                sTimer = m.getModel('List.SearchTimer', {"id": -1});
                this.requestForm(sTimer);
            }
        }
    },

    "SearchTimerUpdate": {
        "labels": {
            "on": VDRest.app.translate("Trigger Update")
        },
        "state": "on",
        "scope": 'Gui.SearchTimer',
        "fn": function () {

            this.triggerUpdate();
        }
    },

    "Refresh": {
        "labels": {
            "on": VDRest.app.translate("Refresh")
        },
        "state": "on",
        "scope": 'Gui.SearchTimer',
        "fn": function () {

            this.refresh();
        }
    }
};

Gui.SearchTimer.prototype.depends = [
    'recordingdirsloaded',
    'extepginfosloaded',
    'channelgroupsloaded',
    'blacklistsloaded',
    'contentdescriptorsloaded'
];

Gui.SearchTimer.prototype.init = function () {

    VDRest.Abstract.Module.prototype.init.call(this);

    this.isMuted = true;

    this.dependsEvents = this.depends.join(' ');

    $window.on(this.dependsEvents, this.unmute.bind(this));
};

Gui.SearchTimer.prototype.unmute = function (e) {

    this.depends.splice(this.depends.indexOf(e.type, 1));

    if (0 === this.depends.length) {

        $window.off(this.dependsEvents, this.unmute.bind(this));
        this.isMuted = false;
    }
};

/**
 * dispatch default view
 */
Gui.SearchTimer.prototype.dispatch = function () {

    this.store = this.getStore();
    this.getController('List').dispatchView();
};

/**
 * @return {VDRest.SearchTimer}
 */
Gui.SearchTimer.prototype.getStore = function () {

    if (!this.store) {
        this.store = VDRest.app.getModule('VDRest.SearchTimer');
    }
    return this.store;
};

/**
 * destroy view
 */
Gui.SearchTimer.prototype.destruct = function () {

    this.getController('List').destructView(true);
};

/**
 * refresh
 */
Gui.SearchTimer.prototype.refresh = function () {

    this.getView('List').node.empty();

    this.getStore().getModel('List').flushCollection();
    delete this.store.cache.store.Model['List.SearchTimer'];
    delete this.store.cache.store.Controller['Default'];
    delete this.cache.store.Controller['List.SearchTimer'];
    delete this.cache.store.View['List.SearchTimer'];
    delete this.cache.store.ViewModel['List.SearchTimer'];
    this.dispatch();
};

/**
 * retrieve template select window
 * @param {{}} templates
 */
Gui.SearchTimer.prototype.getTemplateSelect = function (templates) {

    var data, values = {

        "none" : {
            "label" : VDRest.app.translate("No Template"),
            "value" : false,
            "selected" : true
        }
    }, i;

    for (i in templates) {
        if (templates.hasOwnProperty(i)) {
            values[i] = {
                "label" : i,
                "value" : i,
                "translate" : false
            }
        }
    }

    data = {
        "type": "enum",
        "dom": $('<label class="clearer text">'),
        "values": values,
        "value" : ""
    };

    $('<span>').text(VDRest.app.translate('Choose Template')).appendTo(data.dom);

    data.gui = $('<input type="text" name="template">')
        .appendTo(data.dom);
    data.gui.val(data.value);

    data.gui.one('change', this.requestForm.bind(this));

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Select",
            "data" : data
        }
    });
};

Gui.SearchTimer.prototype.requestForm = function (e) {

    var sTimer = VDRest.app.getModule('VDRest.SearchTimer')
        .getModel('List.SearchTimer', {"id" : -1});

    if (e instanceof jQuery.Event && e.target.value !== VDRest.app.translate('No Template')) {
        sTimer.loadTemplate(e.target.value);
    }

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "SearchTimer",
            "data" : {
                "id": -1,
                "resource": sTimer,
                "onsubmit": function (fields) {
                    sTimer.save(fields);
                }
            }
        }
    })
};

/**
 * refresh
 */
Gui.SearchTimer.prototype.triggerUpdate = function () {

    $window.one('vdrest-api-actions.SearchTimer-update-triggered', function () {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "Notification",
                "data": {
                    "text": VDRest.app.translate('Update triggered')
                }
            }
        });

    }.bind(this));

    this.getStore().getResource('List.SearchTimer').triggerUpdate();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.SearchTimer', true);