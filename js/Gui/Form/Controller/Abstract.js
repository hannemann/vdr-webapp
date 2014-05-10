/**
 * @class
 * @constructor
 */
Gui.Form.Controller.Abstract = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Form.Controller.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * init parentView
 */
Gui.Form.Controller.Abstract.prototype.init = function () {

    this.view = this.module.getView('Abstract', this.data);
};
/**
 * init parentView
 */
Gui.Form.Controller.Abstract.prototype.dispatchView = function () {

    var i;

    for (i in this.view.data.fields) {

        if (this.view.data.fields.hasOwnProperty(i)) {

            this.addGetter(this.view.data.fields[i]);
        }
    }

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event handler
 */
Gui.Form.Controller.Abstract.prototype.addObserver = function () {

    var me = this, i;

    $(document).on("destruct.form-" + this.keyInCache + " destruct.window-" + this.keyInCache, function () {

        me.view.destruct();
        me.module.cache.flushByClassKey(me);
        me.removeObserver();
    });

    for (i in this.view.data.fields) {

        if (this.view.data.fields.hasOwnProperty(i)) {

            if (this.view.data.fields[i].hasOwnProperty('dom')
                && this.view.data.fields[i].type !== 'boolean'
            ) {

                this.addClickHandler(this.view.data.fields[i]);
            }

            this.addChangeHandler(this.view.data.fields[i], i);
        }
    }

    $(document).on('gui.form.update-' + this.keyInCache, $.proxy(this.update, this));
};
/**
 * add click handler to field
 * @param field
 */
Gui.Form.Controller.Abstract.prototype.addClickHandler = function (field) {

    var me = this;

    field.dom.on('click', function (e) {

        var type = 'Input';

        e.preventDefault();

        if (!field.disabled) {

            if ("enum" ===field.type) {

                type = 'Select';
            }
            me.requestInput(field, type);
        }
    });
};

/**
 * handle change events
 * @param field
 * @param fieldName
 */
Gui.Form.Controller.Abstract.prototype.addChangeHandler = function (field, fieldName) {

    var me = this;

    field.gui.on('change', function () {

        if (me.hasDependencies(fieldName)) {

            me.handleDependency(field, fieldName);
        }

        if ("function" === typeof me.data.changed) {
            me.data.changed(me.data.fields);
        }
    });
};

/**
 * add value getters to fields
 * @param field
 */
Gui.Form.Controller.Abstract.prototype.addGetter = function (field) {

    if (field.type === 'enum') {

        field.getValue = function () {

            var i;

            for (i in this.values) {

                if (this.values.hasOwnProperty(i)) {

                    if (this.values[i].selected) {
                        return this.values[i];
                    }
                }
            }
        }
    } else if (field.type === 'string' || field.type === 'number') {

        field.getValue = function () {

            return this.gui.val();
        }
    } else if (field.type === 'boolean') {

        field.getValue = function () {

            return this.gui.prop('checked');
        }
    }
};

/**
 * remove event listeners
 */
Gui.Form.Controller.Abstract.prototype.removeObserver = function () {

    var i;

    for (i in this.data.fields) {

        if (this.data.fields.hasOwnProperty(i) && this.data.fields[i].hasOwnProperty('dom')) {

            this.data.fields[i].dom.off('click');

            this.data.fields[i].gui.off('change');
        }
    }

    $(document).on('gui.form.update-' + this.keyInCache);
};

/**
 * in case of checkbox, check if field has dependencies to be activated
 * @param fieldName
 * @returns {boolean}
 */
Gui.Form.Controller.Abstract.prototype.hasDependencies = function (fieldName) {

    var i, depends;

    for (i in this.data.fields) {

        if (this.data.fields.hasOwnProperty(i)) {

            depends = this.data.fields[i].depends;
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
Gui.Form.Controller.Abstract.prototype.handleDependency = function (field, fieldName) {

    var i, depends;

    for (i in this.data.fields) {

        if (this.data.fields.hasOwnProperty(i)) {

            depends = this.data.fields[i].depends;
            if ("undefined" !== typeof depends && depends === fieldName) {

                if (field.gui.prop('checked')) {

                    this.data.fields[i].dom.removeClass('disabled');
                    this.data.fields[i].disabled = false;

                } else {

                    this.data.fields[i].dom.addClass('disabled');
                    this.data.fields[i].disabled = true;
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
Gui.Form.Controller.Abstract.prototype.requestInput = function (field, type) {

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
 * call update method
 */
Gui.Form.Controller.Abstract.prototype.update = function (e) {

    var method = e.payload.method, args = e.payload.args;

    if ("function" === typeof this[method]) {

        this[method].apply(this, args);
    }
};

/**
 * call update method
 */
Gui.Form.Controller.Abstract.prototype.updateCacheKey = function (keyInCache) {

    var keys = this.data.cacheKey.split('/'), values = keyInCache.split('/'), i = 0, l = keys.length;

    this.module.cache.flushByClassKey(this);

    this.keyInCache = keyInCache;
    this.data.keyInCache = keyInCache;

    for (i;i<l;i++) {

        this.data[keys[i]] = values[i];
    }

    this.view.keyInCache = keyInCache;

    this.removeObserver();
    this.addObserver();

    this.module.cache.store.Controller[this._class][keyInCache] = this;
    this.module.cache.store.View[this._class][keyInCache] = this.view;
};