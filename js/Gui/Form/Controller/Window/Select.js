/**
 * @class
 * @constructor
 */
Gui.Form.Controller.Window.Select = function () {};

/**
 * @type {Gui.Window.ViewModel.Input}
 */
Gui.Form.Controller.Window.Select.prototype = new Gui.Form.Controller.Window.Input();

/**
 * initialize view
 */
Gui.Form.Controller.Window.Select.prototype.init = function () {

    this.eventPrefix = 'window.select';

    this.view = this.module.getView('Window.Select', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Form.Controller.Window.Select.prototype.dispatchView = function () {

    if ("function" === typeof this.data.renderBefore) {
        this.data.renderBefore();
    }

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.preventReload(this.view.node[0], this.view.node[0], true)
        .preventReload(this.view.valuesWrapper[0], this.view.valuesWrapper[0], true)
        .addObserver();
    this.setPosition();
};

Gui.Form.Controller.Window.Select.prototype.addObserver = function () {

    var i;

    Gui.Form.Controller.Window.Input.prototype.addObserver.call(this);

    this.changeHandler = this.handleChange.bind(this);

    for (i in this.view.values) {

        if (this.view.values.hasOwnProperty(i)) {

            this.view.values[i].gui[0].addEventListener('change',this.changeHandler);
        }
    }
};

Gui.Form.Controller.Window.Select.prototype.removeObserver = function () {

    var i;

    Gui.Form.Controller.Window.Input.prototype.removeObserver.call(this);

    for (i in this.view.values) {

        if (this.view.values.hasOwnProperty(i)) {

            this.view.values[i].gui[0].removeEventListener('change',this.changeHandler);
        }
    }
};

Gui.Form.Controller.Window.Select.prototype.handleChange = function (e) {

    var i, value, type = this.data.multiselect ? 'checkbox' : 'radio';

    if (e.currentTarget instanceof HTMLInputElement) {

        for (i in this.view.values) {
            if (this.view.values.hasOwnProperty(i) && this.view.values[i].label === e.currentTarget.value) {
                value = this.view.values[i];

                if ("radio" === type) {
                    value.dom.parent('.wrapper').find('label').removeClass('selected');
                }
                VDRest.Abstract.Controller.prototype.vibrate();
                value.dom.toggleClass('selected', value.gui[0].checked === true);

                if ("undefined" !== typeof this.data.hasButtons && false === this.data.hasButtons) {

                    this.okAction(e);
                }

                break;
            }
        }
    }
};