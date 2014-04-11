
Gui.Menubar.View.Default = function () {};

Gui.Menubar.View.Default.prototype = new VDRest.Abstract.View();

Gui.Menubar.View.Default.prototype.init = function () {

    this.node = $('<div id="menubar"><div class="drawer-indicator"></div></div>');

    this.epgWrapper = $('<div class="epg-wrapper"><div class="date"></div></div>');
};

Gui.Menubar.View.Default.prototype.render = function () {

    this.addIcon().addThrobber();
    this.node.prependTo(this.parentView.node);
};

Gui.Menubar.View.Default.prototype.showEpgWrapper = function () {

    this.node.append(this.epgWrapper);
};

Gui.Menubar.View.Default.prototype.setEpgDate = function (date) {

    var text = VDRest.helper.getWeekDay(date, true) + ', ' + VDRest.helper.getDateString(date);
    this.epgWrapper.find('.date').text(text);
};

Gui.Menubar.View.Default.prototype.addIcon = function () {

    this.icon = $('<img src="/assets/icon.png" class="icon">')
        .appendTo(this.node);

    return this;
};

Gui.Menubar.View.Default.prototype.addThrobber = function () {

    this.throbber = $('<img src="/assets/ajax-loader-lightblue.gif" id="throbber">')
        .appendTo(this.node);

    return this;
};