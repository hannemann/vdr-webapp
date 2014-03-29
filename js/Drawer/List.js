DrawerList = function () {};

DrawerList.prototype.name = 'drawer';

DrawerList.prototype.dom = $('<ul>').attr('id', 'drawer');

DrawerList.prototype.header = $('<li>').text('Seiten').addClass('header').append($('<div>').addClass('close').html('&#10006;'));

DrawerList.prototype.items = {};

DrawerList.prototype.noConfig = true;

DrawerList.prototype.opened = false;

DrawerList.prototype.onIsClosed = false;

DrawerList.prototype.onIsOpen = false;

DrawerList.prototype.init = function () {
    var i;
    for (i in main.modules) {
        if ("undefined" !== typeof main.modules[i].optionName) {
            this.items[i] = {
                "module":main.modules[i],
                "listItem":new DrawerListItem(main.modules[i], this)
            };
        }
    }
    this.dispatch();
};

DrawerList.prototype.dispatch = function () {
    var i;
    this.dom.append(this.header);
    for (i in this.items) {
        this.dom.append(this.items[i].listItem.dispatch());
    }
    this.addDomEvents();
    this.dom.insertAfter('#menubar');
};

DrawerList.prototype.addDomEvents = function () {
    var me = this;
    this.dom.find('.close').on('click', function () {
        window.history.back();
        me.close();
    });
    $('#drawer-button').on('click', function () {
        me.open();
    });
};

DrawerList.prototype.open = function () {

    if (this.opened) return;
    this.dom.animate({"width":"50%"}, 'fast', 'swing', $.proxy(function () {
        main.destroy = function () {
            this.close();
        };
        window.location.hash = '#show-drawer';
        this.opened = true;
        if ("function" === typeof this.onIsOpen) {
            this.onIsOpen();
        }
    }, this));
};

DrawerList.prototype.close = function () {
    if (!this.opened) return;
    this.dom.animate({"width":"0"}, 'fast', $.proxy(function () {
        this.opened = false;
        if ("function" === typeof this.onIsClosed) {
            this.onIsClosed();
        }
    }, this));
};

DrawerList.prototype.setCurrent = function (module) {
    this.dom.find('.navi-button').removeClass('current');
    this.dom.find('.navi-button.'+module).addClass('current');
};

main.registerModule('DrawerList');