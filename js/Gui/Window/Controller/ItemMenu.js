/**
 * @class
 * @constructor
 * @var {object} data
 */
Gui.Window.Controller.ItemMenu = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.ItemMenu.prototype = new Gui.Window.Controller.Abstract();

/**
 * initialize view
 */
Gui.Window.Controller.ItemMenu.prototype.init = function () {

    this.eventPrefix = 'window.itemmenu';

    this.view = this.module.getView('ItemMenu', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.vibrate();
};

/**
 * dispatch
 */
Gui.Window.Controller.ItemMenu.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
    this.setPosition();
};

/**
 * add event listeners
 */
Gui.Window.Controller.ItemMenu.prototype.addObserver = function () {

    var buttons = this.data.config.buttons, i;

    for (i in buttons) {
        if (buttons.hasOwnProperty(i)) {
            if ("function" === typeof buttons[i].fn) {
                this.view[i + 'Button'].on('click', this.handleButtonClick.bind(this, buttons[i].fn));
            }
        }
    }

    this.view.modalOverlay.one('click', function () {

        if (!this.skipBack) {
            history.back();
        }
        this.skipBack = undefined;
    }.bind(this));
};

/**
 * add event listeners
 */
Gui.Window.Controller.ItemMenu.prototype.removeObserver = function () {

    var buttons = this.data.config.buttons, i;

    for (i in buttons) {
        if (buttons.hasOwnProperty(i)) {
            if ("function" === typeof buttons[i].fn) {
                this.view[i + 'Button'].off('click');
            }
        }
    }
    this.view.modalOverlay.off('click');
};

/**
 * call method defined as callback
 */
Gui.Window.Controller.ItemMenu.prototype.handleButtonClick = function (callback) {

    this.vibrate();

    this.skipBack = true;

    history.back();

    $document.one(this.animationEndEvents, function () {

        callback();
    });
};