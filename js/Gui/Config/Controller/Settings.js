Gui.Config.Controller.Settings = function () {};

Gui.Config.Controller.Settings.prototype = new VDRest.Abstract.Controller();

Gui.Config.Controller.Settings.prototype.init = function () {

    this.view = this.module.getView('Settings');

    this.module.getViewModel('Settings', {
        "view" : this.view
    });
};