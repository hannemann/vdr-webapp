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

    $('<img src="data:image/png;base64,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" class="icon">')
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
 * @returns {*|jQuery|HTMLElement}
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

    this.throbber = $('<img src="data:image/gif;base64,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" id="throbber">')
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