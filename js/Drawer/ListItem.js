DrawerListItem = function (options, drawer) {
    this.module = options;
    this.drawer = drawer;
    this.dom = $('<li>').addClass('navi-button');
};

/**
 * render button
 * @return {*}
 */
DrawerListItem.prototype.dispatch = function () {

    this.dom.addClass(this.module.name);
    this.dom.text(this.module.optionName);
    this.addDomEvents();

    return this.dom;
};

/**
 * add click event to button
 */
DrawerListItem.prototype.addDomEvents = function () {

    this.dom.on('click', $.proxy(function () {

        $(document).one('drawerClosed', $.proxy(this.closedCallback, this));
        this.drawer.close();

    }, this));
};

/**
 * callback to fire if drawer is closed
 */
DrawerListItem.prototype.closedCallback = function () {

    var moduleName = this.module.name;

    window.history.back();

    setTimeout(function () {

        window.location.hash = '#' + moduleName;

    }, 100);
};