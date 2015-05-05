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

    this.view.ok.one('click', this.okAction.bind(this));

    if (this.data.settings) {
        this.view.settings.one('click', this.settingsAction.bind(this))
    }

    $window.on("resize", this.setPosition.bind(this));
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Alert.prototype.removeObserver = function () {

    this.view.ok.off('click');

    $window.off("resize");

    Gui.Window.Controller.Abstract.prototype.removeObserver.call(this);
};

/**
 * handle ok click
 */
Gui.Window.Controller.Alert.prototype.okAction = function () {

    this.vibrate();

    history.back();
};

/**
 * request configuration page
 */
Gui.Window.Controller.Alert.prototype.settingsAction = function () {

    this.vibrate();

    $document.one(this.animationEndEvents, function () {
        VDRest.Abstract.Controller.prototype.destructView.call(this);
        VDRest.app.dispatch('Gui.Config');
    }.bind(this));
    this.view.node.toggleClass('collapse expand');
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