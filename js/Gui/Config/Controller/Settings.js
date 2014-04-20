/**
 * @class
 * @constructor
 */
Gui.Config.Controller.Settings = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Config.Controller.Settings.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Config.Controller.Settings.prototype.init = function () {

    VDRest.app.getModule('Gui.Viewport').getView('Default').node.addClass(this.module.name.toLowerCase());

    this.view = this.module.getView('Settings');
    this.view.setParentView(VDRest.app.getModule('Gui.Viewport').getView('Default'));

    this.module.getViewModel('Settings', {
        "view" : this.view
    });
};

/**
 * dispatxh
 */
Gui.Config.Controller.Settings.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Config.Controller.Settings.prototype.addObserver = function () {

    var i;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i)) {

            if (this.view.fields[i].hasOwnProperty('dom')
                && this.view.fields[i].type !== 'boolean'
            ) {

                this.addClickHandler(this.view.fields[i]);
            }

            if (this.hasDependencies(i) && this.view.fields[i].type === 'boolean') {

                this.addChangeHandler(this.view.fields[i], i);
            }
        }
    }

    $(document).on('setting.changed', $.proxy(this.persist, this));
};
/**
 * add click handler to field
 * @param field
 */
Gui.Config.Controller.Settings.prototype.addClickHandler = function (field) {

    var me = this;

    field.dom.on('click', function (e) {

        var type = 'Input';

        if ("enum" ===field.type) {

            type = 'Select';
        }

        e.preventDefault();
        me.requestInput(field, type);
    });
};

/**
 * handle change events
 * @param field
 * @param fieldName
 */
Gui.Config.Controller.Settings.prototype.addChangeHandler = function (field, fieldName) {

    var me = this;

    field.gui.on('change', function () {

        me.handleDependency(field, fieldName);

        me.persist();
    });
};

/**
 * remove event listeners
 */
Gui.Config.Controller.Settings.prototype.removeObserver = function () {

    var i;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i) && this.view.fields[i].hasOwnProperty('dom')) {

            this.view.fields[i].dom.off('click', $.proxy(this.requestInput, this));
        }
    }
};

/**
 * in case of checkbox, check if field has dependencies to be activated
 * @param fieldName
 * @returns {boolean}
 */
Gui.Config.Controller.Settings.prototype.hasDependencies = function (fieldName) {

    var i, depends;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i)) {

            depends = this.view.fields[i].depends;
            if ("undefined" !== typeof depends && depends === fieldName) {

                return true;
            }
        }
    }
    return false;
};

/**
 * toggle dependent fields
 * @param field
 * @param fieldName
 * @returns {boolean}
 */
Gui.Config.Controller.Settings.prototype.handleDependency = function (field, fieldName) {

    var i, depends;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i)) {

            depends = this.view.fields[i].depends;
            if ("undefined" !== typeof depends && depends === fieldName) {

                if (field.gui.prop('checked')) {

                    this.view.fields[i].dom.removeClass('disabled');
                    this.view.fields[i].disabled = false;

                } else {

                    this.view.fields[i].dom.addClass('disabled');
                    this.view.fields[i].disabled = true;
                }
            }
        }
    }
    return false;
};

/**
 * request input window
 * @param field
 * @param type
 */
Gui.Config.Controller.Settings.prototype.requestInput = function (field, type) {

    if (false === field.disabled) {

        $.event.trigger({
            "type" : "window.request",
            "payload" : {
                "type" : type,
                "data" : field
            }
        });
    }
};

/**
 * persist settings
 */
Gui.Config.Controller.Settings.prototype.persist = function () {

    var i, n, value, values;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i) && this.view.fields[i].hasOwnProperty('gui')) {

            if (this.view.fields[i].type === "boolean") {

                value = this.view.fields[i].gui.prop('checked');

            } else if (this.view.fields[i].type === "enum") {

                if ("function" === typeof this.view.fields[i].values) {

                    values = this.view.fields[i].values();

                } else {

                    values = this.view.fields[i].values;

                }

                for (n in values) {

                    if (values.hasOwnProperty(n) && values[n].label === this.view.fields[i].gui.val()) {

                        value = values[n].value;
                    }
                }

            } else {

                value = this.view.fields[i].gui.val();
            }

            VDRest.config.setItem(i, value);
        }
    }
};