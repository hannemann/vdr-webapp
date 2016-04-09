/**
 * @class
 * @constructor
 */
Gui.Form.Controller.Window.Input = function () {};

/**
 * @type {Gui.Form.Controller.Window.Abstract}
 */
Gui.Form.Controller.Window.Input.prototype = new Gui.Window.Controller.Abstract();

/**
 * init view
 */
Gui.Form.Controller.Window.Input.prototype.init = function () {

    this.eventPrefix = 'window.input';

    this.view = this.module.getView('Window.Input', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Form.Controller.Window.Input.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.preventReload()
        .addObserver();
    this.setPosition();
};

/**
 * add event listeners
 */
Gui.Form.Controller.Window.Input.prototype.addObserver = function () {

    if ("number" === this.data.type) {

        this.view.body.find('input').on('keydown', function (e) {

            if (9 === e.which) {

                e.preventDefault();
                this.okAction(e);
            }
        }.bind(this));
    }

    this.view.node.on('submit', this.okAction.bind(this));



    if ("undefined" === typeof this.data.hasButtons || true === this.data.hasButtons) {

        this.view.ok.on('click', this.okAction.bind(this));

        this.view.cancel.on('click', this.cancel.bind(this));
    }

    $window.on("resize.input-window", this.setPosition.bind(this));
};

/**
 * remove event listeners
 */
Gui.Form.Controller.Window.Input.prototype.removeObserver = function () {

    if ("number" === this.data.type) {

        this.view.body.find('input').off('keydown');
    }

    if ("undefined" === typeof this.data.hasButtons || true === this.data.hasButtons) {
        
        this.view.ok.off('click');

        this.view.cancel.off('click');
    }

    $window.off("resize.input-window");
};

/**
 * handle confirm
 */
Gui.Form.Controller.Window.Input.prototype.okAction = function (e) {

    this.vibrate();

    var type = this.data.type;

    e.preventDefault();

    if ("string" === type || "number" === type) {

        this.setStringLike();
    }

    if ("enum" === type || "channel" === type) {

        this.setEnum();
    }

    if ("directory" === type) {

        this.setDirectory();
    }

    if ("datetime" === type) {

        this.setDateTime();
    }

    if ("combobox" === type) {

        this.setComboBox();
    }

    this.goBack(true);
};

/**
 * copy strings to target
 */
Gui.Form.Controller.Window.Input.prototype.setStringLike = function () {

    var value = this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]').val();

    this.data.gui.val(value);

    return value;
};

/**
 * copy strings to target
 */
Gui.Form.Controller.Window.Input.prototype.setComboBox = function () {

    var value = this.view.header.find('input[name="' + this.data.gui.attr('name') + '_text"]').val(),
        i, values = this.data.values;

    this.data.gui.val(value);

    for (i in values) {
        if (values.hasOwnProperty(i)) {
            values[i].selected = false;
        }
    }

    value.split(this.data.text_input_seperator).forEach(function (v) {

        for (i in values) {
            if (values.hasOwnProperty(i) && v == i) {
                values[i].selected = true;
            }
        }
    }.bind(this));

    return value;
};

/**
 * copy strings to target
 */
Gui.Form.Controller.Window.Input.prototype.setDateTime = function () {

    var value = this.data.format,
        output = this.data.form_order,
        reg = new RegExp('%[' + this.supported.all + ']');

    this.view.body.find('select').each(function () {

        var val = $(this).val();
        value = value.replace(reg, val);
        if (this.classList.contains('year')) {
            output = output.replace(/Y/, val);
        }
        if (this.classList.contains('month')) {
            output = output.replace(/m/, val);
        }
        if (this.classList.contains('monthname')) {
            output = output.replace(/F/, val);
        }
        if (this.classList.contains('day')) {
            output = output.replace(/d/, val);
        }
        if (this.classList.contains('hour')) {
            output = output.replace(/H/, val);
        }
        if (this.classList.contains('minute')) {
            output = output.replace(/i/, val);
        }
    });

    this.data.gui.val(value);
    this.data.value = output;

    return value;
};

/**
 * copy enum
 */
Gui.Form.Controller.Window.Input.prototype.setEnum = function () {

    var i, value = this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]:checked'), values = [];

    if (this.data.multiselect) {

        this.data.selected = [];

        for (i in this.data.values) {

            if (this.data.values.hasOwnProperty(i)) {

                this.data.values[i].selected = false;
            }
        }
        value.each(function (key, input) {
            values.push(VDRest.app.translate(input.value));

            for (i in this.data.values) {

                if (this.data.values.hasOwnProperty(i)) {

                    if (this.data.values[i].label === input.value) {
                        this.data.values[i].selected = true;
                        this.data.selected.push(this.data.values[i].value);
                    }
                }
            }
        }.bind(this));

        this.data.gui.val(values.join(', '));

    } else {

        this.data.gui.val(VDRest.app.translate(value.val()));

        for (i in this.data.values) {

            if (this.data.values.hasOwnProperty(i)) {

                this.data.values[i].selected = false;

                this.data.values[i].selected = (this.data.values[i].label === value.val());
                if (this.data.values[i].selected) {
                    this.data.selected = this.data.values[i].value;
                }
            }
        }
    }

    return value;
};

/**
 * copy directory
 */
Gui.Form.Controller.Window.Input.prototype.setDirectory = function () {

    var i, value,
        checked = this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]:checked'),
        path = [];

    checked.parents('label.directory').each(function () {

        path.push($(this).find('input:first').val());
    });
    path.pop(); // remove root

    value = path.reverse().join('~');

    this.data.gui.val(value);

    for (i in this.data.values) {

        if (this.data.values.hasOwnProperty(i)) {

            this.data.values[i].selected = false;

            this.data.values[i].selected = (this.data.values[i].label === value);
        }
    }

    return value;
};

/**
 * cancel action
 */
Gui.Form.Controller.Window.Input.prototype.cancel = function () {

    this.vibrate();

    this.goBack(false);
};

/**
 * destroy, trigger change
 * @param {boolean} trigger
 */
Gui.Form.Controller.Window.Input.prototype.goBack = function (trigger) {

    $window.one(this.animationEndEvents, function () {

        this.module.cache.invalidateClasses(this);

        if (trigger) {
            this.data.gui.change();
            if ("function" === typeof this.data.onchange) {
                this.data.onchange(this);
            }
        }
    }.bind(this));

    history.back();
};
