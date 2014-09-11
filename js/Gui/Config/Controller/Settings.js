/**
 * @class
 * @constructor
 */
Gui.Config.Controller.Settings = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Config.Controller.Settings.prototype = new Gui.Form.Controller.Abstract();

/**
 * initialize view
 */
Gui.Config.Controller.Settings.prototype.init = function () {

    var me = this;

    VDRest.app.getModule('Gui.Viewport').getView('Default').node.addClass(this.module.name.toLowerCase());

    this.view = this.module.getView('Settings');
    this.view.setParentView(VDRest.app.getModule('Gui.Viewport').getView('Default'));

    this.module.getViewModel('Settings', {
        "view" : this.view
    });

    this.data.changed = function () {

        me.persist();
    }
};

/**
 * persist settings
 */
Gui.Config.Controller.Settings.prototype.persist = function () {

    var i, n, value, values;

    for (i in this.view.data.fields) {

        if (this.view.data.fields.hasOwnProperty(i) && this.view.data.fields[i].hasOwnProperty('gui')) {

            if (this.view.data.fields[i].type === "boolean") {

                value = this.view.data.fields[i].gui.prop('checked');

            } else if (this.view.data.fields[i].type === "enum") {

                if ("function" === typeof this.view.data.fields[i].values) {

                    values = this.view.data.fields[i].values();

                } else {

                    values = this.view.data.fields[i].values;

                }

                for (n in values) {

                    if (values.hasOwnProperty(n) &&
                        VDRest.app.translate(values[n].label) === this.view.data.fields[i].gui.val()) {

                        value = values[n].value;
                    }
                }

            } else {

                value = this.view.data.fields[i].gui.val();
            }

            VDRest.config.setItem(i, value);
        }
    }
};