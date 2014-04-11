
Gui.Menubar.View.Default = function () {};

Gui.Menubar.View.Default.prototype = new VDRest.Abstract.View();

Gui.Menubar.View.Default.prototype.init = function () {

    this.node = $('<div id="menubar"><div class="drawer-indicator"></div></div>');
};

Gui.Menubar.View.Default.prototype.render = function () {

    this.addIcon()
        .addContent()
        .addThrobber()
        .addSettingsButton();
    this.node.prependTo(this.parentView.node);
};

Gui.Menubar.View.Default.prototype.addIcon = function () {

    this.icon = $('<img src="/assets/icon.png" class="icon">')
        .appendTo(this.node);

    return this;
};

Gui.Menubar.View.Default.prototype.addContent = function () {

    this.content = $('<div class="menubar-content"><div id="header"></div></div>')
        .appendTo(this.node);
    this.header = this.content.find('#header');

    return this;
};

Gui.Menubar.View.Default.prototype.addThrobber = function () {

    this.throbber = $('<img src="/assets/ajax-loader-lightblue.gif" id="throbber">')
        .appendTo(this.node);

    return this;
};

Gui.Menubar.View.Default.prototype.addSettingsButton = function () {

    this.settingsButton = $('<div id="button-settings">')
        .appendTo(this.node);

    return this;
};

Gui.Menubar.View.Default.prototype.setTitle = function (title) {

    this.header.text(title);

    return this;
};