
Gui.Menubar.View.Default = function () {};

Gui.Menubar.View.Default.prototype = new VDRest.Abstract.View();

Gui.Menubar.View.Default.prototype.init = function () {

    this.main = $('<div id="menubar">');
};

Gui.Menubar.View.Default.prototype.render = function () {

    this.main.appendTo('body');
};