/**
 * @class
 * @constructor
 */
Gui.Window.Controller.DateTime = function () {
};

/**
 * @type {Gui.Window.ViewModel.Input}
 */
Gui.Window.Controller.DateTime.prototype = new Gui.Window.Controller.Input();

/**
 * supported date types
 */
Gui.Window.Controller.DateTime.prototype.supported = {
    "all": "YFmdHi",
    "Y": {
        "reg": new RegExp("[0-9]{4}"),
        "regString": "[0-9]{4}"
    },
    "F": {
        "reg": new RegExp("(" + VDRest.helper.monthNames().join('|') + ")"),
        "regString": VDRest.helper.monthNames().join('|')
    },
    "m": {
        "reg": new RegExp("[0-9]{2}"),
        "regString": "[0-9]{2}"
    },
    "d": {
        "reg": new RegExp("[0-9]{2}"),
        "regString": "[0-9]{2}"
    },
    "H": {
        "reg": new RegExp("[0-9]{2}"),
        "regString": "[0-9]{2}"
    },
    "i": {
        "reg": new RegExp("[0-9]{2}"),
        "regString": "[0-9]{2}"
    }
};

/**
 * initialize view
 */
Gui.Window.Controller.DateTime.prototype.init = function () {

    this.eventPrefix = 'window.datetime';

    this.view = this.module.getView('DateTime', this.data);

    this.view.supported = this.supported;

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Window.Controller.DateTime.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
    this.setPosition();
};