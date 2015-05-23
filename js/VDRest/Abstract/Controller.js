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
VDRest.Abstract.Controller.prototype.animationEndEvents = function () {

    if ("object" == typeof navigator.mozApps) {
        return 'animationend';
    }

    if ('onanimationend' in window) {
        return 'animationend';
    }

    if ('onwebkitanimationend' in window) {
        return 'webkitAnimationEnd';
    }

    if ('onmozanimationend' in window) {
        return 'mozanimationend';
    }

    if ('onotransitionend' in window) {
        return 'otransitionend'
    }

    if ('onmsnimationend' in window) {
        return 'MSAnimationEnd'
    }

}();

/**
 * transitionEnd event names
 * @type {string}
 */
VDRest.Abstract.Controller.prototype.transitionEndEvents = function () {

    if ("object" == typeof navigator.mozApps) {
        return 'transitionend';
    }

    if ('ontransitionend' in window) {
        return 'transitionend';
    }

    if ('onwebkittransitionend' in window) {
        return 'webkittransitionend';
    }

    if ('onmoztransitionend' in window) {
        return 'moztransitionend';
    }

    if ('onotransitionend' in window) {
        return 'otransitionend'
    }

    if ('onmstransitionend' in window) {
        return 'mstransitionend'
    }

}();

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
 * prevent page reload on scroll
 */
VDRest.Abstract.Controller.prototype.preventScrollReload = function () {

    var args = Array.prototype.slice.apply(arguments),
        event = undefined,
        node = undefined;

    args.forEach(function (arg) {
        if (arg instanceof Event) {
            event = arg;
        } else if (arg instanceof HTMLElement) {
            node = arg;
        } else if (arg instanceof jQuery.Event) {
            event = arg.originalEvent;
        } else if (arg instanceof jQuery) {
            node = arg[0];
        }
    });

    node = node || this.view.node[0];

    if (
        event && node &&
        0 === node.scrollTop &&
        event.changedTouches[0].pageY > VDRest.helper.touchStartPosition.y
    ) {
        event.preventDefault();
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

    var event;

    if (VDRest.config.getItem('debug') && this.view.node) {

        if (VDRest.helper.isTouchDevice) {
            event = 'touchstart';
        } else {
            event = 'click';
        }
        this.view.node[0].removeEventListener(event, this.logDebugHandler);
    }

    if ("function" === typeof this.removeObserver) {

        this.removeObserver();
    }

    this.view.destruct();
};

