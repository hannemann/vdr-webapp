/**
 * @class
 * @constructor
 * @property {Gui.Form.View.Abstract} view
 */
Gui.Form.Controller.Abstract = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Form.Controller.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * init view
 */
Gui.Form.Controller.Abstract.prototype.init = function () {

    this.view = this.module.getView('Abstract', this.data);
};
/**
 * dispatch
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

    $document.on("destruct.form-" + this.keyInCache + " destruct.window-" + this.keyInCache, function () {

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

            if (this.view.data.fields[i].type !== 'info') {

                this.addChangeHandler(this.view.data.fields[i], i);
            }
        }
    }

    $document.on('gui.form.update-' + this.keyInCache, this.update.bind(this));
};
/**
 * add click handler to field
 * @param field
 */
Gui.Form.Controller.Abstract.prototype.addClickHandler = function (field) {

    field.dom.on('click', {"field": field}, this.handleClick.bind(this));
};

Gui.Form.Controller.Abstract.prototype.handleClick = function (e) {

    var type = 'Input';

    e.preventDefault();

    if (!e.data.field.disabled) {

        if ("enum" === e.data.field.type) {

            type = 'Select';
        }

        if ("channel" === e.data.field.type) {

            type = 'ChannelChooser';
        }

        if ("directory" === e.data.field.type) {

            type = 'DirectoryChooser';
        }

        if ("info" === e.data.field.type) {

            type = e.data.field.window;
        }

        this.vibrate();
        this.requestInput(e.data.field, type);
    }
};

/**
 * handle change events
 * @param field
 * @param fieldName
 */
Gui.Form.Controller.Abstract.prototype.addChangeHandler = function (field, fieldName) {

    var me = this;

    field.gui.on('change', function () {

        if ("boolean" === field.type) {
            VDRest.Abstract.Controller.prototype.vibrate();
        }

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

    if (field.type === 'enum' || field.type === 'channel') {

        field.getValue = function () {

            var i, values = this.values, retVal = [];

            if ("function" === typeof this.values) {

                values = this.values();
            }

            for (i in values) {

                if (values.hasOwnProperty(i)) {

                    if (values[i].selected) {
                        if (field.multiselect) {
                            retVal.push(values[i]);
                        } else {
                            return values[i];
                        }
                    }
                }
            }

            return retVal.length > 0 ? retVal : {"value" : null};
        }
    } else if (field.type === 'string' || field.type === 'number' || field.type === 'directory') {

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

    for (i in this.view.data.fields) {

        if (this.view.data.fields.hasOwnProperty(i)) {

            if (this.view.data.fields[i].dom) {
                this.view.data.fields[i].dom.off('click');
            }

            if (this.view.data.fields[i].gui) {
                this.view.data.fields[i].gui.off('change');
            }
        }
    }

    $document.off('gui.form.update-' + this.keyInCache);
};

/**
 * in case of checkbox, check if field has dependencies to be activated
 * @param fieldName
 * @returns {boolean}
 */
Gui.Form.Controller.Abstract.prototype.hasDependencies = function (fieldName) {

    var i, depends;

    for (i in this.view.data.fields) {

        if (this.view.data.fields.hasOwnProperty(i)) {

            depends = this.view.data.fields[i].depends;
            if ("undefined" !== typeof depends && (depends === fieldName || depends[fieldName])) {

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

    for (i in this.view.data.fields) {

        if (this.view.data.fields.hasOwnProperty(i)) {

            depends = this.view.data.fields[i].depends;
            if ("undefined" !== typeof depends && (depends === fieldName || depends[fieldName])) {

                if (!this.isDisabled(field, depends)) {

                    this.view.data.fields[i].dom.removeClass('disabled');
                    this.view.data.fields[i].disabled = false;

                } else {

                    this.view.data.fields[i].dom.addClass('disabled');
                    this.view.data.fields[i].disabled = true;
                }
            }
        }
    }
    return false;
};

/**
 * check if field has to be disabled
 * @param field
 * @param depends
 * @return {boolean}
 */
Gui.Form.Controller.Abstract.prototype.isDisabled = function (field, depends) {

    var value = field.getValue(), i;

    if ("boolean" === field.type && !value) {
        return true;
    }

    if ('enum' === field.type || 'channel' === field.type) {
        if (field.multiselect) {

        } else {
            for (i in depends) {
                if (depends.hasOwnProperty(i) && this.view.data.fields.hasOwnProperty(i)) {
                    if (value.value !== depends[i]) {
                        return true;
                    }
                }
            }
        }
    }

    if ('string' === field.type || 'number' === field.type || 'directory' === field.type) {

        if (value !== depends) {
            return true;
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

    var payload;

    if (false === field.disabled) {

        payload = {
            "type": type,
            "data": field
        };

        if (field.module) {
            payload.module = field.module;
        }

        $.event.trigger({
            "type" : "window.request",
            "payload": payload
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