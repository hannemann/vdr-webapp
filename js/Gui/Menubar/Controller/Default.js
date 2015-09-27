/**
 * @class
 * @constructor
 * @property {Gui.Menubar.View.Default} view
 */
Gui.Menubar.Controller.Default = function () {};

/**
 * @type {VDRest.Lib.Cache.store.Controller}
 */
Gui.Menubar.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * throbber counter
 * @type {number}
 */
Gui.Menubar.Controller.Default.prototype.throbberCalls = 0;

/**
 * transparency counter
 * @type {number}
 */
Gui.Menubar.Controller.Default.prototype.transparencyCalls = 0;

/**
 * transparency indicator
 * @type {boolean}
 */
Gui.Menubar.Controller.Default.prototype.isTransparent = false;

/**
 * has big font indicator
 * @type {boolean}
 */
Gui.Menubar.Controller.Default.prototype.bigFont = false;

/**
 * has context menu indicator
 * @type {boolean}
 */
Gui.Menubar.Controller.Default.prototype.hasContextMenu = true;

/**
 * defer click on icon
 * @type {boolean}
 */
Gui.Menubar.Controller.Default.prototype.deferIconClick = false;

/**
 * initialize
 */
Gui.Menubar.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default');

    $document.on('dispatch.after', this.view.setTitle.bind(this.view));

    this.view.setParentView({"node":$('body')});

    this.drawerDispatched = false;

    $.event.trigger('menubar.init');
};

/**
 * call render, add observer
 */
Gui.Menubar.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();

    document.body.classList.add('has-menubar');
};

/**
 * show spinner in upper right corner
 * increase calls
 */
Gui.Menubar.Controller.Default.prototype.showThrobber = function () {

    if (this.throbberCalls === 0) {
        this.view.node.addClass('has-throbber');
        this.view.settingsButton.css({"display" : "none"});
        this.view.throbber.toggleClass('show', true);
    }
    this.throbberCalls++;
};

/**
 * hide spinner in upper right corner
 * decrease calls
 * @param {jQuery.Event} e
 */
Gui.Menubar.Controller.Default.prototype.hideThrobber = function (e) {

    this.throbberCalls--;
    if (this.throbberCalls <= 0 || e.force) {
        this.view.node.removeClass('has-throbber');
        this.view.throbber.toggleClass('show', false);
        this.view.settingsButton.css({"display" : ""});
        this.throbberCalls = 0;
    }
};

/**
 * add events to elements
 */
Gui.Menubar.Controller.Default.prototype.addObserver = function () {

    $document.on('drawer.statechanged', this.onDrawerReady.bind(this));

    $document.on('drawer.animate', this.onDrawerAnimate.bind(this));

    this.view.titleWrapper.on('click', this.onIconClick.bind(this));

    $document.on('dispatch.after', this.handlePostDispatch.bind(this));
    window.addEventListener('hashchange', this.handlePostDispatch.bind(this));
    $document.on('window.request window.close', this.handlePostDispatch.bind(this));

    this.view.settingsButton.on('click', this.requestContextMenu.bind(this));

    $document.on('showThrobber', this.showThrobber.bind(this));
    $document.on('hideThrobber', this.hideThrobber.bind(this));

    $document.on('showContextMenu', this.showContextMenu.bind(this));
    $document.on('hideContextMenu', this.hideContextMenu.bind(this));

    this.view.throbber.on('click', $.xhrPool.abortAll.bind($.xhrPool));

    $document.on('transparentMenubar', this.setTransparency.bind(this));
};

/**
 * actions after new module is dispatched
 */
Gui.Menubar.Controller.Default.prototype.handlePostDispatch = function () {

    this.view.decorateIndicator(this.isStartPage());
};

/**
 * retrieve configuration for contextMenu
 * @returns {object}
 */
Gui.Menubar.Controller.Default.prototype.getContextMenu = function () {

    this.contextMenu = VDRest.app.getCurrent(true).contextMenu;

    if ("undefined" === typeof this.contextMenu) {

        this.contextMenu = {};
    }

    return this.contextMenu
};

/**
 * request context menu
 */
Gui.Menubar.Controller.Default.prototype.requestContextMenu = function (e) {

    e.stopPropagation();

    if (this.view.settingsButton.hasClass('inactive')) {
        return;
    }

    if (this.drawerDispatched) {

        history.back()

    } else {

        this.vibrate();

        $.event.trigger({
            "type" : "window.request",
            "payload" : {
                "type" : "ContextMenu",
                "data" : this.getContextMenu()
            }
        });
    }
};

/**
 * hide the settings button
 */
Gui.Menubar.Controller.Default.prototype.hideContextMenu = function () {
    this.view.node.addClass('inactive-button-settings');
    this.hasContextMenu = false;
};

/**
 * show th settings button
 */
Gui.Menubar.Controller.Default.prototype.showContextMenu = function () {
    this.view.node.removeClass('inactive-button-settings');
    this.hasContextMenu = true;
};

/**
 * determine if current dispatched page matches configured start page
 * @returns {boolean}
 */
Gui.Menubar.Controller.Default.prototype.isStartPage = function () {

    var w = VDRest.app.getModule('Gui.Window'),
        c = w.getLastRegister(),
        count = w.count();

    if (c instanceof Gui.Window.Controller.Drawer) {
        return true;
    }

    if (c instanceof Gui.Video.Controller.Player) {
        count--;
    }

    return ( VDRest.config.getItem('start') === VDRest.app.getCurrent() && count === 0 ) || "undefined" !== typeof this.initial
};

/**
 * handle drawer animation ready state
 * @param e
 */
Gui.Menubar.Controller.Default.prototype.onDrawerReady = function (e) {

    this.drawerDispatched = !!e.payload;

    this.deferIconClick = false;
};

/**
 * handle drawer starts animation
 */
Gui.Menubar.Controller.Default.prototype.onDrawerAnimate = function () {

    this.deferIconClick = true;
};

/**
 * handle click on icon
 */
Gui.Menubar.Controller.Default.prototype.onIconClick = function (e) {

    this.vibrate();

    e.stopPropagation();

    if (!this.deferIconClick) {

        if ("undefined" !== typeof this.initial) {

            this.initial = undefined;

            location.replace(
                location.href.replace(/#.*$/, '#' + VDRest.config.getItem('start'))
            );

        } else if (this.drawerDispatched) {

            history.back()

        } else {

            if (!this.isStartPage()) {

                history.back();

            } else {

                $.event.trigger({
                    "type": 'window.request',
                    "payload": {
                        "type": "Drawer"
                    }
                });

            }
        }
    }
};

/**
 * set transparency
 * @param {{}} e
 * @param {{}|boolean} e.payload
 * @param {boolean} e.payload.set
 * @param {boolean} e.payload.omitIncrement
 */
Gui.Menubar.Controller.Default.prototype.setTransparency = function (e) {

    if (true === e.payload || true === e.payload.set) {
        if (this.transparencyCalls === 0) {
            document.body.classList.add('transparent-menubar');
            this.view.drawerIndicator[0].classList.add('text-shadow');
        }
        if ("undefined" === typeof e.payload.omitIncrement) {
            this.transparencyCalls++;
        }
        this.isTransparent = true;
    } else if (false === e.payload || false === e.payload.set) {

        this.transparencyCalls--;
        if (this.transparencyCalls <= 0) {
            document.body.classList.remove('transparent-menubar');
            this.view.drawerIndicator[0].classList.remove('text-shadow');
            this.transparencyCalls = Math.max(0, this.transparencyCalls);
            this.isTransparent = false;
        }
    }
};

/**
 * add big font class
 */
Gui.Menubar.Controller.Default.prototype.setBigFont = function () {

    this.view.node.addClass('big-font');
    this.bigFont = true;
};

/**
 * remove big font class
 */
Gui.Menubar.Controller.Default.prototype.setNormalFont = function () {

    this.view.node.removeClass('big-font');
    this.bigFont = false;
};

/**
 * reset to default state
 */
Gui.Menubar.Controller.Default.prototype.resetState = function () {

    this.setTransparency({
        "payload" : {
            "set" : false
        }
    });
    this.transparencyCalls = 0;
    this.setNormalFont();
    this.showContextMenu();
};


/**
 * @typedef {{}} menuBarState
 * @property {boolean} transparency
 * @property {boolean} bigFont
 * @property {number} transparencyCalls
 * @property {boolean} hasContextMenu
 */
/**
 * retrieve state object
 * @return {menuBarState}
 */
Gui.Menubar.Controller.Default.prototype.getState = function () {

    return {
        "transparency" : this.isTransparent,
        "bigFont" : this.bigFont,
        "transparencyCalls" : this.transparencyCalls,
        "hasContextMenu" : this.hasContextMenu
    }
};

/**
 * recover state
 * @param {menuBarState} state
 */
Gui.Menubar.Controller.Default.prototype.recoverState = function (state) {

    this.setTransparency({
        "payload" : {
            "set" : state.transparency
        }
    });

    if (state.bigFont) {
        this.setBigFont();
    } else {
        this.setNormalFont();
    }

    if (state.hasContextMenu) {
        this.showContextMenu();
    } else {
        this.hideContextMenu();
    }

    this.transparencyCalls = state.transparencyCalls;
};

/**
 * @param {boolean} i
 */
Gui.Menubar.Controller.Default.prototype.setHasProblem = function (i) {

    this.hasProblem = i;
    if (i) {
        this.view.titleWrapper.addClass('pulse-red');
    } else {
        this.view.titleWrapper.removeClass('pulse-red');
    }
};
