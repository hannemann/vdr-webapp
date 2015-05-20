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

    var event;

    if (VDRest.config.getItem('debug') && this.view.node) {

        this.logDebugHandler = this.logDebug.bind(this);

        if (VDRest.helper.isTouchDevice) {
            event = 'touchstart';
        } else {
            event = 'click';
        }
        this.view.node[0].addEventListener(event, this.logDebugHandler);
    }

    if (VDRest.helper.isTouchDevice) {
        this.touchStartHandler = this.getTouchStart.bind(this);
        this.touchMoveHandler = this.cancelMove.bind(this);
        this.view.node[0].addEventListener('touchstart', this.touchStartHandler);
        this.view.node[0].addEventListener('touchmove', this.touchMoveHandler);
    }

    this.view.render();
};

VDRest.Abstract.Controller.prototype.logDebug = function () {

    VDRest.helper.log(this);
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
 * get touch start position
 * @param e
 */
VDRest.Abstract.Controller.prototype.getTouchStart = function (e) {

    this.canCancel = false;

    this.touchStartPosition = {
        "x" : e.changedTouches[0].pageX,
        "y" : e.changedTouches[0].pageY
    };
};

/**
 * determine if touch event is cancelable
 * @param e
 */
VDRest.Abstract.Controller.prototype.cancelMove = function (e) {

    if (Math.abs(e.changedTouches[0].pageX - this.touchStartPosition.x) > 5 ||
        Math.abs(e.changedTouches[0].pageY - this.touchStartPosition.y) > 5) {

        this.canCancel = true;
    }
};

/**
 * destruct view
 */
VDRest.Abstract.Controller.prototype.destructView = function () {

    var event;

    if (VDRest.config.getItem('debug') && this.view.node) {

        if (VDRest.helper.isTouchDevice) {
            event = 'touchstart';
        } else {
            event = 'click';
        }
        this.view.node[0].removeEventListener(event, this.logDebugHandler);
    }

    if (VDRest.helper.isTouchDevice) {
        this.view.node[0].removeEventListener('touchstart', this.touchStartHandler);
        this.view.node[0].removeEventListener('touchmove', this.touchMoveHandler);
    }

    if ("function" === typeof this.removeObserver) {

        this.removeObserver();
    }

    this.view.destruct();
};

