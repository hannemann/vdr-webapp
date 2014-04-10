
Gui.Menubar.View.Default = function () {};

Gui.Menubar.View.Default.prototype = new VDRest.Abstract.View();

Gui.Menubar.View.Default.prototype.init = function () {

    this.node = $('<div id="menubar">');

    this.epgWrapper = $('<div id="epg-wrapper"><div class="date"></div></div>');
};

Gui.Menubar.View.Default.prototype.render = function () {

    this.node.prependTo(this.parentView.node);
};

Gui.Menubar.View.Default.prototype.showEpgWrapper = function () {

    this.node.append(this.epgWrapper);
};

Gui.Menubar.View.Default.prototype.setEpgDate = function (date) {

    var text = VDRest.helper.getWeekDay(date, true) + ', ' + VDRest.helper.getDateString(date);
    this.epgWrapper.find('.date').text(text);
};