
Gui.Window.View.Abstract = function () {};

Gui.Window.View.Abstract.prototype = new VDRest.Abstract.View();

Gui.Window.View.Abstract.prototype.init = function () {

    this.node = $('<div id="window">');
};

Gui.Window.View.Abstract.prototype.render = function () {

    this.node.appendTo('body');
};