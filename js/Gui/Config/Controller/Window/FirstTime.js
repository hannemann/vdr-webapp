/**
 * @class
 * @constructor
 * @method {boolean} hasImages
 * @method {Array} getImages
 */
Gui.Config.Controller.Window.FirstTime = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Config.Controller.Window.FirstTime.prototype = new Gui.Window.Controller.Abstract();

/**
 * initialize view
 */
Gui.Config.Controller.Window.FirstTime.prototype.init = function () {

    this.eventPrefix = 'window.firsttime';

    this.view = this.module.getView('Window.FirstTime', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * Destroy
 */
Gui.Config.Controller.Window.FirstTime.prototype.destructView = function () {

    var me = this;
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
    // apply animation
    this.view.node.toggleClass('collapse expand');
};