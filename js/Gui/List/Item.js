Gui.List.Item = function () {
    GuiItem.apply(this, arguments);
};

Gui.List.Item.prototype.mainClassName = 'list-item';

Gui.List.Item.prototype = new GuiItem();
