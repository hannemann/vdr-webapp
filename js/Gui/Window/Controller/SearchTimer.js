/**
 * @class
 * @constructor
 */
Gui.Window.Controller.SearchTimer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.SearchTimer.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.SearchTimer.prototype.cacheKey = 'id';

/**
 * init view and view model
 */
Gui.Window.Controller.SearchTimer.prototype.init = function () {

    this.eventPrefix = 'window.searchtimer-' + this.data.id;

    this.eventNameSpace = this.module.namespace + '-' + this.module.name;

    this.view = this.module.getView('SearchTimer', this.data);

    this.module.getViewModel('SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.data.resource
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    VDRest.helper.log(this);
};

/**
 * Destroy
 */
Gui.Window.Controller.SearchTimer.prototype.destructView = function () {

    var me = this;

    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};