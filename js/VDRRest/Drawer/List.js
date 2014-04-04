VDRest.DrawerList = function () {};

/**
 * @type {String}
 */
VDRest.DrawerList.prototype.name = 'drawer';

/**
 * @type {*}
 */
VDRest.DrawerList.prototype.dom = $('<ul>').attr('id', 'drawer');

/**
 * @type {*}
 */
VDRest.DrawerList.prototype.header = $('<li>').text('Seiten').addClass('header').append($('<div>').addClass('close').html('&#10006;'));

/**
 * @type {Object}
 */
VDRest.DrawerList.prototype.items = {};

/**
 * @type {Boolean}
 */
VDRest.DrawerList.prototype.noConfig = true;

/**
 * @type {Boolean}
 */
VDRest.DrawerList.prototype.isOpen = false;

/**
 * initilize buttons and dispatch
 */
VDRest.DrawerList.prototype.init = function () {
    var i;
    for (i in VDRest.app.modules) {
        if (VDRest.app.modules.hasOwnProperty(i)) {
            if ("undefined" !== typeof VDRest.app.modules[i].optionName) {
                this.items[i] = {
                    "module":VDRest.app.modules[i],
                    "listItem":new VDRest.DrawerListItem(VDRest.app.modules[i], this)
                };
            }
        }
    }

    $(document).on('dispatchBefore', $.proxy(this.close, this));
    $(document).on('dispatchAfter', $.proxy(this.setCurrent, this));

    this.dispatch();
};

/**
 * append buttons and render drawer
 */
VDRest.DrawerList.prototype.dispatch = function () {
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
VDRest.DrawerList.prototype.addDomEvents = function () {
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
VDRest.DrawerList.prototype.open = function () {

    if (this.isOpen) return;
    this.dom.animate({"width":"50%"}, 'fast', 'swing', $.proxy(function () {

        VDRest.app.addDestroyer($.proxy(function () {
            this.close();
        }, this));

        VDRest.app.addDestroyer('drawer.hashChanged', $.proxy(this.close, this));

        VDRest.app.setLocationHash('show-drawer');
        this.isOpen = true;
        $.event.trigger({
            "type":"drawerOpen"
        });
    }, this));
};


/**
 * close the drawer, fire event afterwards
 */
VDRest.DrawerList.prototype.close = function () {

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
VDRest.DrawerList.prototype.setCurrent = function (moduleName) {

    if ("string" !== typeof moduleName) {
        moduleName = VDRest.app.getCurrent();
    }

    this.dom.find('.navi-button').removeClass('current');
    this.dom.find('.navi-button.'+moduleName).addClass('current');
};

VDRest.app.registerModule('DrawerList');