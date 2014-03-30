Actions.ConfirmDelete.View = function (win) {
    this.window = win;
};

Actions.ConfirmDelete.View.prototype = new Gui.Window.View();

Actions.ConfirmDelete.View.constructor = Actions.ConfirmDelete.View;

Actions.ConfirmDelete.View.prototype.hasCloseButton = false;

Actions.ConfirmDelete.View.prototype.modal = true;
