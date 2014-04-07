
Gui.Viewport.View.Default = function () {};

Gui.Viewport.View.Default.prototype = new VDRest.Abstract.View();

Gui.Viewport.View.Default.prototype.init = function () {

    this.main = $('<div id="viewport">');
};

Gui.Viewport.View.Default.prototype.render = function () {

    this.main.appendTo('body');
};