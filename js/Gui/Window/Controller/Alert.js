/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Alert = function () {};

/**
 * @type {Gui.Window.Controller.Input}
 */
Gui.Window.Controller.Alert.prototype = new Gui.Window.Controller.Input();

/**
 * @type {boolean}
 */
Gui.Window.Controller.Alert.prototype.singleton = true;

/**
 * initialize view
 */
Gui.Window.Controller.Alert.prototype.init = function () {

    this.eventPrefix = 'window.alert';

    this.view = this.module.getView('Alert', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * add event listeners
 */
Gui.Window.Controller.Alert.prototype.addObserver = function () {

    this.view.ok.one('click', $.proxy(this.okAction, this));

    $(window).on("resize", $.proxy(this.setPosition, this));
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Alert.prototype.removeObserver = function () {

    this.view.ok.off('click', $.proxy(this.okAction, this));

    $(window).off("resize", $.proxy(this.setPosition, this));
};

/**
 * handle ok click
 */
Gui.Window.Controller.Alert.prototype.okAction = function () {

    history.back();
};

/**
 * Destroy
 */
Gui.Window.Controller.Alert.prototype.destructView = function () {

    var me = this;
    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};