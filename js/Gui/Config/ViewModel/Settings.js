Gui.Config.ViewModel.Settings = function () {};

Gui.Config.ViewModel.Settings.prototype = new VDRest.Abstract.ViewModel();

Gui.Config.ViewModel.Settings.prototype.init = function  () {

    this.backend = this.module.store;

    this.fields = this.backend.fields;

    this.categories = this.backend.categories;

    this.data.view.fields = this.fields;

    this.data.view.catConfig = this.categories;

    this.initViewMethods();
};

Gui.Config.ViewModel.Settings.prototype.initViewMethods = function () {

    var i;

    for (i in this.fields) {

        if (this.fields.hasOwnProperty(i)) {

            this.defineViewMethod(i, this.fields[i]);
            this.fields[i].getValue = this.data.view['get' + this.getMethodFragment(i)];
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

        this.definePrimitive(name, field);
    }
};

Gui.Config.ViewModel.Settings.prototype.definePrimitive = function (name, field) {

    var fragment = this.getMethodFragment(name), me = this, dataType;

    dataType = field.hasOwnProperty('dataType') ? field.dataType : field.type;

    this.data.view['get' + fragment] = function () {

        var item = me.backend.getItem(name);

        return item;
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
