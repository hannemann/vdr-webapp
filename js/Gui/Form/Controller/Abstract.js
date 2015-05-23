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

    if ("function" === typeof this.data.onsubmit) {
        this.view.cancel.on('click', function () {
            this.vibrate();
            history.back();
        }.bind(this));
        this.view.ok.on('click', this.submit.bind(this));
    }

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
 * remove event listeners
 */
Gui.Form.Controller.Abstract.prototype.removeObserver = function () {

    var i;

    if ("function" === typeof this.data.onsubmit) {
        this.view.cancel.off('click');
        this.view.ok.off('click');
    }

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

Gui.Form.Controller.Abstract.prototype.submit = function () {

    this.vibrate();

    this.data.container.one(this.animationEndEvents, function () {

        this.data.onsubmit(this.data.fields);

    }.bind(this));

    history.back();
};

/**
 * add click handler to field
 * @param field
 */
Gui.Form.Controller.Abstract.prototype.addClickHandler = function (field) {

    field.dom.on('click', {"field": field}, this.handleClick.bind(this));
};

Gui.Form.Controller.Abstract.prototype.handleClick = function (e) {

    e.preventDefault();

    if (!e.data.field.disabled) {

        this.vibrate();
        this.requestInput(e.data.field, this.getWindowType(e.data.field));
    }
};

/**
 * determine type of window to be raised
 * @param {{type: String}} field
 * @return {string}
 */
Gui.Form.Controller.Abstract.prototype.getWindowType = function (field) {

    var type;

    switch (field.type) {
        case 'enum':
            type = 'Select';
            break;
        case 'channel':
            type = 'ChannelChooser';
            break;
        case 'directory':
            type = 'DirectoryChooser';
            break;
        case 'datetime':
            type = 'DateTime';
            break;
        case 'info':
            type = field.window;
            break;
        case 'combobox':
            type = 'ComboBox';
            break;
        default:
            type = 'Input';
    }

    return type;
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

    switch (field.type) {
        case 'enum':
        case 'channel':
            field.getValue = this.getEnumValue;
            break;
        case 'datetime':
            field.getValue = this.getDateTimeValue;
            break;
        case 'string':
        case 'number':
        case 'directory':
            field.getValue = function () {
                if ('number' === field.type) {
                    return parseFloat(this.gui.val());
                }
                return this.gui.val();
            };
            break;
        case 'boolean':
            field.getValue = function () {
                return this.gui.prop('checked');
            };
            break;
        case 'combobox':
            field.getValue = function () {
                return this.gui.val();
            };
            break;
        case 'info':
            return false;
        default:
            throw new TypeError('Field type ' + field.type + ' not supported');
    }
};

/**
 * retrieve value of dateTime Field
 * @return {*}
 */
Gui.Form.Controller.Abstract.prototype.getDateTimeValue = function () {

    var value = this.value.toString(),
        template = this.format,
        regs = Gui.Form.Controller.Window.DateTime.prototype.supported,
        parts = this.form_order.split(''),
        reg = '', match;

    if (0 == value) {
        return '';
    }

    parts.forEach(function (f) {
        reg += ("(" + regs[f].regString + ")");
    });
    reg = new RegExp(reg);
    match = value.match(reg);
    if (match) {
        match.forEach(function (hit, index) {
            if (index > 0) {
                reg = new RegExp('%' + parts[index - 1]);
                template = template.replace(reg, hit);
            }
        });
    }
    return template;
};

/**
 * retrieve value of enum like field
 * @return {*}
 */
Gui.Form.Controller.Abstract.prototype.getEnumValue = function () {

    var i, values = this.values, retVal = [];

    if ("function" === typeof this.values) {

        values = this.values();
    }

    for (i in values) {

        if (values.hasOwnProperty(i)) {

            if (values[i].selected) {
                if (this.multiselect) {
                    retVal.push(values[i]);
                } else {
                    return values[i];
                }
            }
        }
    }

    return this.multiselect ? retVal : {"value": null};
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
            if ("undefined" !== typeof depends && (depends === fieldName || depends.hasOwnProperty(fieldName))) {

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

    var i, n, dc, depends;

    for (i in this.view.data.fields) {

        if (this.view.data.fields.hasOwnProperty(i)) {

            depends = this.view.data.fields[i].depends;
            if ("undefined" !== typeof depends && (depends === fieldName || depends.hasOwnProperty(fieldName))) {

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

    for (i in this.view.categories) {

        dc = true;
        if (this.view.categories.hasOwnProperty(i)) {
            for (n in this.view.data.fields) {
                if (
                    this.view.data.fields.hasOwnProperty(n) &&
                    this.view.data.fields[n].category === i && !this.view.data.fields[n].disabled
                ) {
                    dc = false;
                    this.view.categories[i].show(0);
                }
            }
            if (dc) {
                this.view.categories[i].hide();
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

    var value = field.getValue(), i, disabled = false, type;

    if ("boolean" === field.type) {
        disabled = !value;
    }

    if ('string' === field.type || 'number' === field.type || 'directory' === field.type) {

        disabled = value !== depends;
    }

    if ('enum' === field.type || 'channel' === field.type) {
        for (i in depends) {
            if (depends.hasOwnProperty(i) && this.view.data.fields.hasOwnProperty(i)) {
                value = this.view.data.fields[i].getValue();
                if (depends[i] instanceof Array) {
                    if (depends[i].indexOf(value.value) < 0) {
                        disabled = true;
                    }
                } else {
                    type = this.view.data.fields[i].type;

                    if ("boolean" === type) {

                        disabled = !value;
                    } else if ('string' === type || 'number' === type || 'directory' === type) {

                        disabled = value !== depends;
                    } else {

                        disabled = value.value !== depends[i];
                    }
                }
            }
            if (disabled) {
                break;
            }
        }
    }

    return disabled;
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
            "type": 'Window.' + type,
            "data": field
        };

        payload.module = field.module
            ? field.module
            : this.windowModule ? this.windowModule : this.module;

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