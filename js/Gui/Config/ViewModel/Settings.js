Gui.Config.ViewModel.Settings = function () {};

Gui.Config.ViewModel.Settings.prototype = new VDRest.Abstract.ViewModel();

Gui.Config.ViewModel.Settings.prototype.init = function  () {

    this.fields = VDRest.Lib.Config.prototype.fields;

    this.view.fields = this.fields;

    this.backend = VDRest.config;

    this.initViewMethods();
};

Gui.Config.ViewModel.Settings.prototype.initViewMethods = function () {

    var i;

    for (i in this.fields) {

        if (this.fields.hasOwnProperty(i)) {

            this.defineViewMethod(i, this.fields[i]);
        }
    }
};

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

        this.defineEnum(name, field);
    }
};

Gui.Config.ViewModel.Settings.prototype.definePrimitive = function (name, field) {

    var fragment = this.getMethodFragment(name), me = this;

    this.view['get' + fragment] = function () {

        return me.backend.getItem(name);
    };

    this.view['set' + fragment] = function (v) {

        if (field.type !== typeof v) {

            throw new TypeError('Value for ' + name + ' is not of type ' + field.type);
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

    this.view['has' + fragment] = function () {

        return typeof me.backend.getItem(name) === field.type;
    };

    this.view['uns' + fragment] = function () {

        return me.backend.removeItem(name);
    };
};

Gui.Config.ViewModel.Settings.prototype.defineEnum = function (name, field) {};