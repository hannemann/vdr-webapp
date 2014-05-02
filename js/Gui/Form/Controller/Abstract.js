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

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event handler
 */
Gui.Form.Controller.Abstract.prototype.addObserver = function () {

    var me = this, i;

    $(document).on("destruct.window-" + this.keyInCache, function () {

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

            if (this.view.data.fields[i].type === 'boolean') {

                this.addChangeHandler(this.view.data.fields[i], i);
            }
        }
    }

    if ("function" === typeof this.data.changed) {
        $(document).on('setting.changed', this.data.changed);
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
Gui.Form.Controller.Abstract.prototype.addChangeHandler = function (field, fieldName) {

    var me = this;

    field.gui.on('change', function () {

        if (me.hasDependencies(fieldName)) {

            me.handleDependency(field, fieldName);
        }
    });
};

/**
 * remove event listeners
 */
Gui.Form.Controller.Abstract.prototype.removeObserver = function () {

    var i;

    for (i in this.view.fields) {

        if (this.view.fields.hasOwnProperty(i) && this.view.fields[i].hasOwnProperty('dom')) {

            this.view.fields[i].dom.off('click');

            this.view.fields[i].gui.off('change');
        }
    }

    $(document).off('setting.changed');

    $(document).on('gui.form.update-' + this.keyInCache);
};

/**
 * in case of checkbox, check if field has dependencies to be activated
 * @param fieldName
 * @returns {boolean}
 */
Gui.Form.Controller.Abstract.prototype.hasDependencies = function (fieldName) {

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
Gui.Form.Controller.Abstract.prototype.handleDependency = function (field, fieldName) {

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