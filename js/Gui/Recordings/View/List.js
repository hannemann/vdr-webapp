
Gui.Recordings.View.List = function () {};

Gui.Recordings.View.List.prototype = new VDRest.Abstract.View();

Gui.Recordings.View.List.prototype.init = function () {

    this.node = $('<div id="recordings-list" class="simple-list clearer">');
};
