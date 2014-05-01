
Gui.Viewport.View.Default = function () {};

Gui.Viewport.View.Default.prototype = new VDRest.Abstract.View();

Gui.Viewport.View.Default.prototype.init = function () {

    this.node = $('<div id="viewport">');

    $('body').addClass(VDRest.config.getItem('theme'));
};

Gui.Viewport.View.Default.prototype.render = function () {

    this.node.appendTo('body');
};