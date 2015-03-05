/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Item.Abstract = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.Item.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Database.Controller.List.Item.Abstract.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Database.Controller.List.Item.Abstract.prototype.init = function () {

    this[this.type.toLowerCase()] = [];

    this.view = this.module.getView('List.Item.' + this.type, this.data);

    this.view.setParentView(this.data.parent.view);
};

/**
 * dispatch view
 */
Gui.Database.Controller.List.Item.Abstract.prototype.dispatchView = function () {

    this['add' + this.type]();

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};
