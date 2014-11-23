/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Item = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.Item.prototype = new VDRest.Abstract.Controller();

Gui.Database.Controller.List.Item.prototype.bypassCache = true;

Gui.Database.Controller.List.Item.prototype.init = function () {

    this.view = this.module.getView('List.' + this.data.type, this.data);

    this.view.setParentView(this.data.parent.view);
};

Gui.Database.Controller.List.Item.prototype.dispatchView = function () {

    this.helper().log(this.data);

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};