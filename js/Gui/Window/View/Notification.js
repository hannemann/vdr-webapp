Gui.Window.View.Notification = function () {
};

Gui.Window.View.Notification.prototype = new VDRest.Abstract.View();

Gui.Window.View.Notification.prototype.init = function () {

    this.node = $('<div>')
        .addClass('window-notification')
        .html(this.data.text);

    if (this.data.error) {
        this.node.addClass('error');
    }
};

Gui.Window.View.Notification.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    setTimeout(this.show.bind(this), 200);
};

Gui.Window.View.Notification.prototype.show = function () {

    this.node.addClass('show');
};

Gui.Window.View.Notification.prototype.hide = function () {

    this.node.removeClass('show');
};
