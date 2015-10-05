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

    this.setPosition();
    this.preventReload()
        .preventReload(this.view.modalOverlay[0])
        .addObserver();
};

/**
 * add event listeners
 */
Gui.Window.Controller.ItemMenu.prototype.addObserver = function () {

    var buttons = this.data.config.buttons, i;

    for (i in buttons) {
        if (buttons.hasOwnProperty(i) && "function" === typeof buttons[i].fn) {

            if (VDRest.helper.isTouchDevice) {
                this.view[i + 'Button']
                    .on('touchend', this.handleUp.bind(this, buttons[i].fn))
                    .on('touchmove', this.handleMove.bind(this))
                    .on('touchstart', this.handleDown.bind(this))
                ;
            } else {
                this.view[i + 'Button']
                    .on('mouseup', this.handleUp.bind(this, buttons[i].fn))
                    .on('mousedown', this.handleDown.bind(this))
                ;
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
                this.view[i + 'Button'].off('mousedown mouseup mousemove');
            }
        }
    }
    this.view.modalOverlay.off('click');
};


/**
 * handle mouseup
 * @param {function} callback
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.ItemMenu.prototype.handleUp = function (callback, e) {

    if (e.cancelable) {
        e.preventDefault();
    }

    if (!this.module.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            this.vibrate();

            if ("undefined" !== typeof this.clickTimeout) {
                window.clearTimeout(this.clickTimeout);
            }

            this.skipBack = true;

            history.back();

            if (!VDRest.helper.canCancelEvent) {
                $document.one(this.animationEndEvents, function () {

                    callback();
                });
            }
        }
    }
};

/**
 * prevent click on move
 */
Gui.Window.Controller.ItemMenu.prototype.handleMove = function () {

    this.preventClick = true;

    if ("undefined" !== typeof this.clickTimeout) {
        window.clearTimeout(this.clickTimeout);
    }
};

/**
 * handle mousedown
 */
Gui.Window.Controller.ItemMenu.prototype.handleDown = function (e) {

    activeAnimate.applyAnimation(e);

    this.preventClick = undefined;

    //this.clickTimeout = window.setTimeout(function () {
    //    if (!this.module.isMuted) {
    //        this.vibrate(100);
    //        this.preventClick = true;
    //
    //        $document.one(VDRest.helper.isTouchDevice ? 'touchend' : 'mouseup', function () {
    //            if (!VDRest.helper.canCancelEvent) {
    //                this.requestMenuAction();
    //            }
    //        }.bind(this));
    //    }
    //}.bind(this), 1000);
};