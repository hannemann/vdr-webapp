Gui.Config.Controller.Settings = function () {};

Gui.Config.Controller.Settings.prototype = new VDRest.Abstract.Controller();

Gui.Config.Controller.Settings.prototype.init = function () {

    VDRest.app.getModule('Gui.Viewport').getView('Default').node.addClass(this.module.name.toLowerCase());

    this.view = this.module.getView('Settings');
    this.view.setParentView(VDRest.app.getModule('Gui.Viewport').getView('Default'));

    this.module.getViewModel('Settings', {
        "view" : this.view
    });
};

Gui.Config.Controller.Settings.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

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
};
Gui.Config.Controller.Settings.prototype.addClickHandler = function (field) {

    var me = this;

    field.dom.on('click', function (e) {

        e.preventDefault();
        me.requestInput(field);
    });
};
Gui.Config.Controller.Settings.prototype.addChangeHandler = function (field, fieldName) {

    var me = this;

    field.gui.on('change', function () {

        me.handleDependency(field, fieldName);
    });
};

Gui.Config.Controller.Settings.prototype.removeObserver = function () {

    var i;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i) && this.view.fields[i].hasOwnProperty('dom')) {

            this.view.fields[i].dom.off('click', $.proxy(this.requestInput, this));
        }
    }
};

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

Gui.Config.Controller.Settings.prototype.requestInput = function (field) {

    if (false === field.disabled) {

        $.event.trigger({
            "type" : "window.request",
            "payload" : {
                "type" : "Input",
                "data" : field
            }
        });
    }
};

Gui.Config.Controller.Settings.prototype.destructView = function () {

    var i, value;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i) && this.view.fields[i].hasOwnProperty('gui')) {

            if (this.view.fields[i].type === "boolean") {

                value = this.view.fields[i].gui.prop('checked');
            } else {

                value = this.view.fields[i].gui.val();
            }

            VDRest.config.setItem(i, value);
        }
    }

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};