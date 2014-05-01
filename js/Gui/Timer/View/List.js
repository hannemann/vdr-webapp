
Gui.Timer.View.List = function () {};

Gui.Timer.View.List.prototype = new VDRest.Abstract.View();

Gui.Timer.View.List.prototype.init = function () {

    this.node = $('<div id="timer-list" class="simple-list clearer">');
};
