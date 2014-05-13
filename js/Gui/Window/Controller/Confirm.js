/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Confirm = function () {};

/**
 * @type {Gui.Window.Controller.Input}
 */
Gui.Window.Controller.Confirm.prototype = new Gui.Window.Controller.Input();

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

    this.view.ok.one('click', $.proxy(this.okAction, this));

    this.view.cancel.one('click', $.proxy(this.cancel, this));

    $(window).on("resize", $.proxy(this.setPosition, this));
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Confirm.prototype.removeObserver = function () {

    this.view.ok.off('click', $.proxy(this.okAction, this));

    this.view.cancel.off('click', $.proxy(this.cancel, this));

    $(window).off("resize", $.proxy(this.setPosition, this));
};

/**
 * handle ok click
 */
Gui.Window.Controller.Confirm.prototype.okAction = function () {

    history.back();

    $.event.trigger({
        "type" : "window.confirm.confirm"
    });
};

/**
 * handle cancel click
 */
Gui.Window.Controller.Confirm.prototype.cancel = function () {

    history.back();

    $(document).off('window.confirm.confirm');
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