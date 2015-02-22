/**
 * @class
 * @constructor
 */
Gui.Config.ViewModel.Settings = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Config.ViewModel.Settings.prototype = new VDRest.Abstract.ViewModel();

/**
 * initialize date
 */
Gui.Config.ViewModel.Settings.prototype.init = function  () {

    this.backend = this.module.store;

    this.fields = this.backend.fields;

    this.categories = this.backend.categories;

    this.data.view.data.fields = this.fields;

    this.data.view.data.catConfig = this.categories;

    this.initViewMethods();
};

/**
 * add specific methods to view
 */
Gui.Config.ViewModel.Settings.prototype.initViewMethods = function () {

    var i;

    for (i in this.fields) {

        if (this.fields.hasOwnProperty(i)) {

            this.defineViewMethod(i, this.fields[i]);
        }
    }
};

/**
 * @param name
 * @param field
 */
Gui.Config.ViewModel.Settings.prototype.defineViewMethod = function (name, field) {

    if ("number" === field.type) {

        this.definePrimitive(name, field);
    }

    if ("string" === field.type) {

        this.definePrimitive(name, field);
    }

    if ("boolean" === field.type) {

        this.definePrimitive(name, field);
    }

    if ("enum" === field.type) {

        this.definePrimitive(name, field);
    }

    if ("info" === field.type) {
        field.module = this.module;
    }
};

/**
 * set configuration
 * @param name
 * @param field
 */
Gui.Config.ViewModel.Settings.prototype.definePrimitive = function (name, field) {

    var fragment = this.getMethodFragment(name), me = this, dataType;

    dataType = field.hasOwnProperty('dataType') ? field.dataType : field.type;

    this.data.view['get' + fragment] = function () {

        return me.backend.getItem(name);
    };

    this.data.view['set' + fragment] = function (v) {

        if (dataType !== typeof v) {

            throw new TypeError('Value for ' + name + ' is not of type ' + dataType);
        }

        $.event.trigger({
            "type" : 'config.' + name + '.changed',
            "payload" : {
                "key" : name,
                "new" : v,
                "old" : me.backend.getItem(name),
                "targetModel" : me.backend
            }
        });

        me.backend.setItem(name, v);

        return me.view;
    };

    this.data.view['has' + fragment] = function () {

        return typeof me.backend.getItem(name) === dataType;
    };

    this.data.view['uns' + fragment] = function () {

        return me.backend.removeItem(name);
    };
};
