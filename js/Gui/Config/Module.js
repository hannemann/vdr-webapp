/**
 * Settings Module
 * @constructor
 */
Gui.Config = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
Gui.Config.prototype = new VDRest.Abstract.Module();

/**
 * @type {string}
 */
Gui.Config.prototype.namespace = 'Gui';

/**
 * Modulename
 * @type {string}
 */
Gui.Config.prototype.name = 'Config';

/**
 * headline in menu bar
 * @type {string}
 */
Gui.Config.prototype.headline = 'Configuration';

/**
 * context menu definition
 * @type {{}}
 */
Gui.Config.prototype.contextMenu = {

    "export" : {
        "labels" : {
            "off" : VDRest.app.translate("Export")
        },
        "state" : "off",
        "scope" : 'Gui.Config',
        "fn" : function () {

            var element = document.createElement('a'),
                data = {}, i;
            for (i in localStorage) {
                if (localStorage.hasOwnProperty(i)) {
                    data[i] = localStorage[i];
                }
            }
            element.setAttribute(
                'href',
                'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
            );
            element.setAttribute(
                'download',
                'vdr-web-client-settings' + VDRest.config.getItem('recordingsSyncId') + '.json'
            );
            element.focus();
            element.click();
        }
    },
    "import" : {
        "labels" : {
            "off" : VDRest.app.translate("Import")
        },
        "state" : "off",
        "dispatchEvent" : {
            "type" : MouseEvent,
            "event" : "click",
            "target" : {
                "selector" : "#import-settings-file"
            }
        }
    }
};

/**
 * add render event
 */
Gui.Config.prototype.init = function () {

    var me = this;

    VDRest.Abstract.Module.prototype.init.call(this);

    $document.on('Config.request', function (e) {

        me.dispatch(e.object);
    });
};

/**
 * dispatch requested type
 */
Gui.Config.prototype.dispatch = function () {

    this.store = VDRest.config;
    this.getController('Settings').dispatchView();
};

/**
 * destroy module
 */
Gui.Config.prototype.destruct = function () {

    this.getController('Settings').destructView();
    this.cache.flush();
};

/**
 * register module
 */
VDRest.app.registerModule('Gui.Config', true);