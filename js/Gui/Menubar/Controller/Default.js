/**
 * @class
 * @constructor
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
 * initialize
 */
Gui.Menubar.Controller.Default.prototype.init = function () {

    var parentView = {"node":$('body')};

    this.view = this.module.getView('Default');

    this.view.setParentView(parentView);

    $.event.trigger('menubar.init');
};

/**
 * call render, add observer
 */
Gui.Menubar.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * show spinner in upper right corner
 * increase calls
 */
Gui.Menubar.Controller.Default.prototype.showThrobber = function () {

    if (this.throbberCalls === 0) {
        this.view.settingsButton.hide();
        this.view.throbber.show();
    }
    this.throbberCalls++;
};

/**
 * hide spinner in upper right corner
 * decrease calls
 */
Gui.Menubar.Controller.Default.prototype.hideThrobber = function (force) {

    this.throbberCalls--;
    if (this.throbberCalls === 0 || force) {
        this.view.throbber.hide();
        this.view.settingsButton.show();
        this.throbberCalls = 0;
    }
};

/**
 * add events to elements
 */
Gui.Menubar.Controller.Default.prototype.addObserver = function () {

    this.view.settingsButton.on('click', function () {
        // TODO: dispatch settings on click
        console.log('Settings');
    });
};