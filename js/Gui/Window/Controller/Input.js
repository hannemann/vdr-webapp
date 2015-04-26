/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Input = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.Input.prototype = new Gui.Window.Controller.Abstract();

/**
 * init view
 */
Gui.Window.Controller.Input.prototype.init = function () {

    this.eventPrefix = 'window.input';

    this.view = this.module.getView('Input', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Window.Controller.Input.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
    this.setPosition();
};

/**
 * adjust position in case keyboard pops up
 */
Gui.Window.Controller.Input.prototype.setPosition = function () {

    var winHeight = $window.height(), height = this.view.node.height(), top;

    if ("Input" === this.keyInCache) {
        top = '25%';
    } else {
        top = parseInt((winHeight - height) / 2, 10) + 'px';
    }

    this.view.node.css({
        "transition" : "top .2s",
        "top": top
    });

};

/**
 * add event listeners
 */
Gui.Window.Controller.Input.prototype.addObserver = function () {


    if ("number" === this.data.type) {

        this.view.body.find('input').on('keydown', function (e) {

            if (9 === e.which) {

                e.preventDefault();
                this.okAction(e);
            }
        }.bind(this));
    }

    this.view.node.on('submit', this.okAction.bind(this));

    this.view.ok.on('click', this.okAction.bind(this));

    this.view.cancel.on('click', this.cancel.bind(this));

    $window.on("resize", this.setPosition.bind(this));
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Input.prototype.removeObserver = function () {

    if ("number" === this.data.type) {

        this.view.body.find('input').off('keydown');
    }

    this.view.ok.off('click');

    this.view.cancel.off('click');

    $window.off("resize");
};

/**
 * handle confirm
 */
Gui.Window.Controller.Input.prototype.okAction = function (e) {

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

    // TODO: change behaviour... Window has to be closed before action is taken... Add visual feedback for long lastin actions like setting custom time in epg context menu

    this.data.gui.change();

    this.goBack();
};

/**
 * copy strings to target
 */
Gui.Window.Controller.Input.prototype.setStringLike = function () {

    var value = this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]').val();

    this.data.gui.val(value);

    return value;
};

/**
 * copy strings to target
 */
Gui.Window.Controller.Input.prototype.setDateTime = function () {

    var value = this.data.format,
        output = this.data.output_format,
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
Gui.Window.Controller.Input.prototype.setEnum = function () {

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
Gui.Window.Controller.Input.prototype.setDirectory = function () {

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
Gui.Window.Controller.Input.prototype.cancel = function () {

    this.vibrate();

    this.goBack();
};

/**
 * destroy, trigger change
 */
Gui.Window.Controller.Input.prototype.goBack = function () {

    this.module.cache.invalidateClasses(this);

    if ("function" === typeof this.data.onchange) {
        this.data.onchange(this);
    }

    history.back();
};
