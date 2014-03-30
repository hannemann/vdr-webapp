DrawerList = function () {};

/**
 * @type {String}
 */
DrawerList.prototype.name = 'drawer';

/**
 * @type {*}
 */
DrawerList.prototype.dom = $('<ul>').attr('id', 'drawer');

/**
 * @type {*}
 */
DrawerList.prototype.header = $('<li>').text('Seiten').addClass('header').append($('<div>').addClass('close').html('&#10006;'));

/**
 * @type {Object}
 */
DrawerList.prototype.items = {};

/**
 * @type {Boolean}
 */
DrawerList.prototype.noConfig = true;

/**
 * @type {Boolean}
 */
DrawerList.prototype.isOpen = false;

/**
 * initilize buttons and dispatch
 */
DrawerList.prototype.init = function () {
    var i;
    for (i in main.modules) {
        if (main.modules.hasOwnProperty(i)) {
            if ("undefined" !== typeof main.modules[i].optionName) {
                this.items[i] = {
                    "module":main.modules[i],
                    "listItem":new DrawerListItem(main.modules[i], this)
                };
            }
        }
    }
    this.dispatch();
};

/**
 * append buttons and render drawer
 */
DrawerList.prototype.dispatch = function () {
    var i;
    this.dom.append(this.header);
    for (i in this.items) {
        if (this.items.hasOwnProperty(i)) {
            this.dom.append(this.items[i].listItem.dispatch());
        }
    }
    this.addDomEvents();
    this.dom.insertAfter('#menubar');
};

/**
 * add open and close functionality
 */
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

/**
 * open the drawer, fire event afterwards
 */
DrawerList.prototype.open = function () {

    if (this.isOpen) return;
    this.dom.animate({"width":"50%"}, 'fast', 'swing', $.proxy(function () {

        main.destroy.push($.proxy(function () {
            this.close();
        }, this));

        window.location.hash = '#show-drawer';
        this.isOpen = true;
        $.event.trigger({
            "type":"drawerOpen"
        });
    }, this));
};


/**
 * close the drawer, fire event afterwards
 */
DrawerList.prototype.close = function () {

    if (!this.isOpen) return;
    this.dom.animate({"width":"0"}, 'fast', $.proxy(function () {

        this.isOpen = false;
        $.event.trigger({
            "type":"drawerClosed"
        });
    }, this));
};

/**
 * add classes to currently active module
 * @param module
 */
DrawerList.prototype.setCurrent = function (module) {
    this.dom.find('.navi-button').removeClass('current');
    this.dom.find('.navi-button.'+module).addClass('current');
};

main.registerModule('DrawerList');