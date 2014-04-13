Gui.Config.Controller.Settings = function () {};

Gui.Config.Controller.Settings.prototype = new VDRest.Abstract.Controller();

Gui.Config.Controller.Settings.prototype.init = function () {

    VDRest.app.getModule('Gui.Menubar').getView('Default').setTitle(this.module.name);
    VDRest.app.getModule('Gui.Viewport').getView('Default').node.addClass(this.module.name.toLowerCase());

    this.view = this.module.getView('Settings');
    this.view.setParentView(VDRest.app.getModule('Gui.Viewport').getView('Default'));

    this.module.getViewModel('Settings', {
        "view" : this.view
    });
};

Gui.Config.Controller.Settings.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);


};