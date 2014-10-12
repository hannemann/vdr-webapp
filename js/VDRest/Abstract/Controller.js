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
 * destruct view
 */
VDRest.Abstract.Controller.prototype.destructView = function () {

    if ("function" === typeof this.removeObserver) {
        this.removeObserver();
    }

    this.view.destruct();
};

