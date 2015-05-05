/**
 * @class
 * @constructor
 */
Gui.SearchTimer.View.List.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.SearchTimer.View.List.SearchTimer.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.cacheKey = 'id';

/**
 * initialize nodes
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.init = function () {


    // TODO: create own css?
    this.node = $('<div class="timer searchtimer list-item clearer">');

    this.channels = $('<div class="channels">').appendTo(this.node);

    this.search = $('<div class="search">').appendTo(this.node);
};

/**
 * decorate and render
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.render = function () {

    this.decorate()
        .addMenuButton();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * decorate
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.decorate = function () {

    this.addClasses().addChannels().addSearch();
    return this;
};

/**
 * add class names
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.addClasses = function () {

    this.node.toggleClass('active', !!this.getUseAsSearchtimer());

    return this;
};

/**
 * add channels
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.addChannels = function () {

    this.channels.text(VDRest.app.translate('Channels') + ': ' + this.getChannels());

    return this;
};

/**
 * add channels
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.addMenuButton = function () {

    this.menuButton = $('<div>').html('&vellip;').addClass('listitem-menu-button');
    this.menuButton.appendTo(this.node);

    return this;
};

/**
 * add name
 */
Gui.SearchTimer.View.List.SearchTimer.prototype.addSearch = function () {

    this.search.text(this.getSearch());

    return this;
};
