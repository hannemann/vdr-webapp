DrawerListItem = function (options, drawer) {
    this.module = options;
    this.drawer = drawer;
    this.dom = $('<li>').addClass('navi-button');
};

DrawerListItem.prototype.dispatch = function () {
    this.dom.addClass(this.module.name);
    this.dom.text(this.module.optionName);
    this.addDomEvents();
    return this.dom;
};

DrawerListItem.prototype.addDomEvents = function () {
    var moduleName = this.module.name;
    this.dom.on('click', $.proxy(function () {

        this.drawer.onIsClosed = function () {
            window.history.go(-1);
            setTimeout(function () {
                window.location.hash = '#' + moduleName;
                this.drawer.onIsClosed = false;
            }, 100);
        };

        this.drawer.close();
    }, this));
};