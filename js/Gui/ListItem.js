GuiListItem = function () {
    GuiItem.apply(this, arguments);
};

GuiListItem.prototype.mainClassName = 'list-item';

GuiListItem.prototype = new GuiItem();
