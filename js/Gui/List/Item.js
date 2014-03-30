Gui.List.Item = function () {
    Gui.Item.apply(this, arguments);
};

Gui.List.Item.prototype.mainClassName = 'list-item';

Gui.List.Item.prototype = new Gui.Item();
