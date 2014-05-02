/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Timer.Edit = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.Timer.Edit.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.Timer.Edit.prototype.cacheKey = 'id';

/**
 * init view and view model
 */
Gui.Window.Controller.Timer.Edit.prototype.init = function () {

    this.eventPrefix = 'window.timer.edit-' + this.data.id;

    this.view = this.module.getView('Timer.Edit', this.data);

    VDRest.helper.log(this.data);

    this.module.getViewModel('Timer.Edit', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.data.resource
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};