Gui.Config.View.Settings = function () {};

Gui.Config.View.Settings.prototype = new Gui.Form.View.Abstract();

Gui.Config.View.Settings.prototype.init = function () {

    this.node = $('<form id="settings">');

    this.categories = {};
};

Gui.Config.View.Settings.prototype.render = function () {

    this.prepareFields();

    this.renderCategories();

    this.node.addClass('window collapsed viewport-fullsize');

    VDRest.Abstract.View.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};
