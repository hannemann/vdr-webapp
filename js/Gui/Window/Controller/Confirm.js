/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Confirm = function () {};

/**
 * @type {Gui.Form.Controller.Window.Input}
 */
Gui.Window.Controller.Confirm.prototype = new Gui.Form.Controller.Window.Input();

/**
 * @type {string}
 */
Gui.Window.Controller.Confirm.prototype.cacheKey = 'id';

/**
 * initialize view
 */
Gui.Window.Controller.Confirm.prototype.init = function () {

    this.eventPrefix = 'window.confirm';

    this.view = this.module.getView('Confirm', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * add event listeners
 */
Gui.Window.Controller.Confirm.prototype.addObserver = function () {

    this.view.ok.one('click', this.okAction.bind(this));

    this.view.cancel.one('click', this.cancel.bind(this));

    $window.on("resize.confirm-window", this.setPosition.bind(this));
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Confirm.prototype.removeObserver = function () {

    this.view.ok.off('click');

    this.view.cancel.off('click');

    $window.off("resize.confirm-window");

    Gui.Window.Controller.Abstract.prototype.removeObserver.call(this);
};

/**
 * handle ok click
 */
Gui.Window.Controller.Confirm.prototype.okAction = function () {

    this.vibrate();

    history.back();

    this.view.node.one(this.animationEndEvents, function () {
        $.event.trigger({
            "type" : "window.confirm.confirm"
        });
    });
};

/**
 * handle cancel click
 */
Gui.Window.Controller.Confirm.prototype.cancel = function () {

    this.vibrate();

    history.back();

    $document.off('window.confirm.confirm');
};

/**
 * Destroy
 */
Gui.Window.Controller.Confirm.prototype.destructView = function () {

    var me = this;
    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};