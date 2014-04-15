
Gui.Menubar.View.Default = function () {};

Gui.Menubar.View.Default.prototype = new VDRest.Abstract.View();

Gui.Menubar.View.Default.prototype.init = function () {

    this.node = $('<div id="menubar"></div>');
    this.drawerIndicator = $('<div class="drawer-indicator"></div>').appendTo(this.node);
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

    this.content = $('<div class="menubar-content">')
        .append(this.getHeader())
        .appendTo(this.node);

    return this;
};

Gui.Menubar.View.Default.prototype.getHeader = function () {

    if (!this.header) {

        this.header = $('<div id="header">');
    }
    return this.header;
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

/**
 * @param {jQuery.Event} e
 * @returns {Gui.Menubar.View.Default}
 */
Gui.Menubar.View.Default.prototype.setTitle = function (e) {

    if (e instanceof jQuery.Event && e.payload && e.payload.headline) {

        this.getHeader().text(e.payload.headline);
    }

    return this;
};