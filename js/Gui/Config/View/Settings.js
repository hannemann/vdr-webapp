Gui.Config.View.Settings = function () {};

Gui.Config.View.Settings.prototype = new VDRest.Abstract.View();

Gui.Config.View.Settings.prototype.init = function () {

    this.node = $('<div>');
};

Gui.Config.View.Settings.prototype.render = function () {



    VDRest.Abstract.View.prototype.render.call(this);
};