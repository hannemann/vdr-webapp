Gui.Window.View.Indicator = function () {
};

Gui.Window.View.Indicator.prototype = new VDRest.Abstract.View();

Gui.Window.View.Indicator.prototype.init = function () {

    this.node = $('<div>')
        .addClass('window-indicator')
        .html(this.data.symbol);

    if ("undefined" !== typeof this.data.className) {
        this.node.addClass(this.data.className);
    }
};

Gui.Window.View.Indicator.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    setTimeout(this.show.bind(this), 200);
};

Gui.Window.View.Indicator.prototype.show = function () {

    this.node.addClass('show');
};

Gui.Window.View.Indicator.prototype.hide = function () {

    this.node.removeClass('show');
};
