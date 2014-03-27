DrawerListItem = function (options) {
    this.module = options;
    this.dom = $('<li>').addClass('navi-button');
};

DrawerListItem.prototype.dispatch = function () {
    this.dom.addClass(this.module.name);
    this.dom.text(this.module.optionName);
    this.addDomEvents();
    return this.dom;
};

DrawerListItem.prototype.addDomEvents = function () {
    this.dom.on('click', $.proxy(function () {
        window.history.back();
        window.location.hash = '#' + this.module.name;
    }, this));
};