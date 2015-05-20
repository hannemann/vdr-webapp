/**
 * @constructor
 */
VDRest.Abstract.Controller = function () {
};

/**
 * define prototype
 * @type {Lib.Object}
 */
VDRest.Abstract.Controller.prototype = new VDRest.Lib.Object();

/**
 * animationEnd event names
 * @type {string[]}
 */
VDRest.Abstract.Controller.prototype.animationEndEvents =
    "webkitAnimationEnd MSAnimationEnd oanimationend animationend";

/**
 * transitionEnd event names
 * @type {string[]}
 */
VDRest.Abstract.Controller.prototype.transitionEndEvents =
    "webkitTransitionEnd MSTransitionEnd otransitionend transitionend";

/**
 * render view
 */
VDRest.Abstract.Controller.prototype.dispatchView = function () {

    if (VDRest.config.getItem('debug') && this.view.node) {

        if (VDRest.helper.isTouchDevice) {
            this.view.node.on('touchstart', function () {
                VDRest.helper.log(this);
            }.bind(this));
        } else {
            this.view.node.on('click', function () {
                VDRest.helper.log(this);
            }.bind(this));
        }
    }

    this.view.render();
};

/**
 * let mobile devices vibrate if capable
 * @param {Array|Number} [sequence]
 */
VDRest.Abstract.Controller.prototype.vibrate = function (sequence) {

    if (!VDRest.config.getItem('hapticFeedback')) return;

    sequence = sequence || 5;

    if (navigator.vibrate) {
        navigator.vibrate(sequence);
    }
};

/**
 * prevent selection and context menu
 */
VDRest.Abstract.Controller.prototype.preventLongPress = function () {

    document.onselectstart = function () {
        return false
    };

    document.oncontextmenu = function () {
        return false;
    };
};

/**
 * reattach selection and context menu
 */
VDRest.Abstract.Controller.prototype.unpreventLongPress = function () {

    document.onselectstart = function () {
        return true
    };

    document.oncontextmenu = function () {
        return true;
    };
};

/**
 * destruct view
 */
VDRest.Abstract.Controller.prototype.destructView = function () {

    if ("function" === typeof this.removeObserver) {
        this.removeObserver();
    }

    this.view.destruct();
};

