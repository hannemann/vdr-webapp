/**
 * @class
 * @constructor
 */
Gui.Menubar.View.Default = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Menubar.View.Default.prototype = new VDRest.Abstract.View();

/**
 * initialize nodes
 */
Gui.Menubar.View.Default.prototype.init = function () {

    this.node = $('<div id="menubar" class="shadow"></div>');
    this.drawerIndicator = $('<div class="drawer-indicator">❮</div>').appendTo(this.node);
    this.titleWrapper = $('<id class="title-wrapper">').appendTo(this.node);
};

/**
 * render
 */
Gui.Menubar.View.Default.prototype.render = function () {

    this.addIcon()
        .addContent()
        .addThrobber()
        .addSettingsButton();
    this.node.prependTo(this.parentView.node);
};

/**
 * add icon
 * @returns {Gui.Menubar.View.Default}
 */
Gui.Menubar.View.Default.prototype.addIcon = function () {

    $('<img src="' + VDRest.image.getIcon() + '" class="icon">')
        .appendTo(this.titleWrapper);

    return this;
};

/**
 * add contents
 * @returns {Gui.Menubar.View.Default}
 */
Gui.Menubar.View.Default.prototype.addContent = function () {

    this.content = $('<div class="menubar-header">')
        .append(this.getHeader())
        .appendTo(this.titleWrapper);

    return this;
};

/**
 * retrieve header
 * @returns {jQuery}
 */
Gui.Menubar.View.Default.prototype.getHeader = function () {

    if (!this.header) {

        this.header = $('<div id="header">');
    }
    return this.header;
};

/**
 * add spinner
 * @returns {Gui.Menubar.View.Default}
 */
Gui.Menubar.View.Default.prototype.addThrobber = function () {

    this.throbber = $('<div style="background: url(' + VDRest.image.getThrobber() + ')" class="throbber">')
        .appendTo(this.node);

    return this;
};

/**
 * add settings button
 * @returns {Gui.Menubar.View.Default}
 */
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

        this.getHeader().text(VDRest.app.translate(e.payload.headline));
    }

    return this;
};

/**
 * decorate indicator according to history state
 * @param start
 */
Gui.Menubar.View.Default.prototype.decorateIndicator = function (start) {

    if (start) {
        this.drawerIndicator.removeClass('back');
    } else {
        this.drawerIndicator.addClass('back');
    }
};