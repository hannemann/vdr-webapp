/**
 * @class
 * @constructor
 * @property {Gui.Config.View.Settings} view
 * @property {FileReader} settingsReader
 * @property {Gui.Form} windowModule
 */
Gui.Config.Controller.Settings = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Config.Controller.Settings.prototype = new Gui.Form.Controller.Abstract();

/**
 * initialize
 */
Gui.Config.Controller.Settings.prototype.init = function () {

    var me = this;

    this.windowModule = VDRest.app.getModule('Gui.Form');

    VDRest.app.getModule('Gui.Viewport').getView('Default').node.addClass(this.module.name.toLowerCase());

    this.view = this.module.getView('Settings');
    this.view.setParentView(VDRest.app.getModule('Gui.Viewport').getView('Default'));

    this.module.getViewModel('Settings', {
        "view" : this.view
    });

    this.data.changed = function () {

        me.persist();
    };

    this.settingsReader = new FileReader();
    this.importFileChoosenHandler = this.handleImport.bind(this);
    this.settingsLoadedHandler = this.handleSettingsLoaded.bind(this);
    this.importErrorHandler = this.handleImportError.bind(this);
};

/**
 * dispatch view
 */
Gui.Config.Controller.Settings.prototype.dispatchView = function () {

    Gui.Form.Controller.Abstract.prototype.dispatchView.call(this);
    this.preventReload();
};

/**
 * add event listeners
 */
Gui.Config.Controller.Settings.prototype.addObserver = function () {

    Gui.Form.Controller.Abstract.prototype.addObserver.call(this);
    this.view.fileUpload.addEventListener('change', this.importFileChoosenHandler);
    this.settingsReader.addEventListener('load', this.settingsLoadedHandler);
    this.settingsReader.addEventListener('error', this.importErrorHandler);
};

/**
 * remove event listeners
 */
Gui.Config.Controller.Settings.prototype.removeObserver = function () {

    Gui.Form.Controller.Abstract.prototype.removeObserver.call(this);
    this.view.fileUpload.removeEventListener('change', this.importFileChoosenHandler);
    this.settingsReader.removeEventListener('load', this.settingsLoadedHandler);
    this.settingsReader.removeEventListener('error', this.importErrorHandler);
};

/**
 * read file
 */
Gui.Config.Controller.Settings.prototype.handleImport = function () {

    if (this.view.fileUpload.files[0]) {
        this.settingsReader.readAsText(this.view.fileUpload.files[0], "UTF-8");
        this.resetImport();
    }
};

/**
 * iterate settings object and merge it into localStorage
 * @param {{}} evt
 * @param {FileReader} evt.target
 * @param {string} evt.target.result
 */
Gui.Config.Controller.Settings.prototype.handleSettingsLoaded = function (evt) {

    var settings = JSON.parse(evt.target.result), i;

    for (i in settings) {
        if (settings.hasOwnProperty(i)) {

            if (settings[i] instanceof Object) {
                settings[i] = this.mergeLocalStorage(i, settings[i]);
            }

            this.module.store.setItem(i, settings[i]);
        }
    }

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Alert",
            "data" : {
                "message" : "Import ready.",
                "info" : "Please reload for changes to take effect."
            }
        }
    });
};

/**
 * handle file reader error
 */
Gui.Config.Controller.Settings.prototype.handleImportError = function () {

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "Alert",
            "data" : {
                "message" : "Error reading file."
            }
        }
    });
};

/**
 * merge already existing objects
 * @param {string} index
 * @param {{}} data
 * @return {{}}
 */
Gui.Config.Controller.Settings.prototype.mergeLocalStorage = function (index, data) {

    var original = localStorage.getItem('index'), i, merged;

    if (!original) {
        return data;
    } else {
        merged = JSON.parse(original);
        for (i in data) {
            if (data.hasOwnProperty(i)) {
                merged[i] = data[i];
            }
        }
        return merged;
    }
};

/**
 * reset file import input field
 */
Gui.Config.Controller.Settings.prototype.resetImport = function () {

    this.view.fileUpload.removeEventListener('change', this.importFileChoosenHandler);
    this.view.removeImportFileInput().addImportFileInput();
    this.view.fileUpload.addEventListener('change', this.importFileChoosenHandler);
};

/**
 * persist settings
 */
Gui.Config.Controller.Settings.prototype.persist = function () {

    var i, n, value, values, multivalues = [];

    for (i in this.view.data.fields) {

        if (this.view.data.fields.hasOwnProperty(i) && this.view.data.fields[i].gui) {

            if (this.view.data.fields[i].type === "boolean") {

                value = this.view.data.fields[i].gui.prop('checked');

            } else if (this.view.data.fields[i].type === "enum" || this.view.data.fields[i].type === "channel") {

                if ("function" === typeof this.view.data.fields[i].values) {

                    values = this.view.data.fields[i].values();

                } else {

                    values = this.view.data.fields[i].values;

                }

                if (this.view.data.fields[i].multiselect) {
                    multivalues = this.view.data.fields[i].gui.val().split(', ');
                    value = [];
                }

                for (n in values) {

                    if (values.hasOwnProperty(n) &&

                        (
                            VDRest.app.translate(values[n].label) === this.view.data.fields[i].gui.val()

                            || (
                                this.view.data.fields[i].multiselect &&
                                multivalues.indexOf(VDRest.app.translate(values[n].label)) > -1
                            )
                        )
                    ) {
                        if (this.view.data.fields[i].multiselect) {
                            value.push(values[n].value);
                        } else {
                            value = values[n].value;
                        }
                    }
                }
                if (this.view.data.fields[i].multiselect) {
                    value = JSON.stringify(value);
                }

            } else {

                value = this.view.data.fields[i].gui.val();
            }

            VDRest.config.setItem(i, value);
        }
    }
};

/**
 * destroy
 */
Gui.Config.Controller.Settings.prototype.destructView = function () {

    this.view.node.one(this.animationEndEvents, function () {

        VDRest.Abstract.Controller.prototype.destructView.call(this);
        delete this.settingsReader;
    }.bind(this));

    this.view.node.toggleClass('collapse expand');
};
