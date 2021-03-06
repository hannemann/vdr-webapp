/**
 * @typedef {{}} TouchMove.Options
 * @property {HTMLElement} wrapper
 * @property {HTMLElement} slider
 * @property {String[]} [allowedOrientations]
 * @property {String[]} [allowedDirections]
 * @property {String} [sliderClassName]
 * @property {{x: Number, y: Number, [easing]: String, [threshold]: Number}} grid
 * @property {function} onmove
 * @property {boolean} hasScrollBars
 * @property {touchMoveScrollBarOptions} scrollBarOptions
 */

/**
 * @typedef {Number} DOMHighResTimeStamp
 */

/**
 * @typedef {{}} performance
 * @method {DOMHighResTimeStamp} now
 */

/**
 * @typedef {Function} requestAnimationFrame
 * @param {Function}
 */

/**
 * @typedef {Function} cancelAnimationFrame
 * @param {Number}
 */

/**
 * @typedef {{}} TouchEvent
 * @property {Array} changedTouches
 */


/**
 * @class
 * @constructor
 */
TouchMove = function (options) {

    options && this.init(options);
};

/**
 * initialize
 * @param {TouchMove.Options} options
 */
TouchMove.prototype.init = function (options) {

    this.allowedOrientations = options.allowedOrientations || ['portrait', 'landscape'];
    this.allowedDirections = options.allowedDirections || ['x', 'y'];

    this.initElements(options).initEvents().apply();
};

/**
 * @param {TouchMove.Options} options
 * @returns {TouchMove}
 */
TouchMove.prototype.initElements = function (options) {

    var sliderClassName = options.sliderClassName || 'touchmove-slide';

    if (!options.wrapper) {
        throw new Error('TouchMove: No wrapper specified');
    }

    this.wrapper = options.wrapper;
    this.slider = new TouchMove.Slider(
        this.wrapper.querySelector('.' + sliderClassName.replace('.', '')),
        this.wrapper,
        options.onmove
    );
    this.tiles = new TouchMove.Tiles(this.slider);
    if (options.hasScrollBars) {
        this.initScrollBars(options);
    }

    return this;
};

/**
 * initialize scroll bars
 * @param {TouchMove.Options} options
 */
TouchMove.prototype.initScrollBars = function (options) {

    var originalCallback = this.slider.onmove,
        scrollBarOptions = {
            "parent" : this.wrapper,
            "scrollElement" : this.slider.elem,
            "isTouchMove" : true
        }, i;

    this.scrollBars = {};

    if ("undefined" !== typeof options.scrollBarOptions) {
        for (i in options.scrollBarOptions) {
            if (options.scrollBarOptions.hasOwnProperty(i)) {
                scrollBarOptions[i] = options.scrollBarOptions[i];
            }
        }
    }

    this.allowedDirections.forEach(function (dir) {
        scrollBarOptions.direction = dir;
        this.scrollBars[dir] = new TouchMove.ScrollBar(scrollBarOptions);
    }.bind(this));

    this.slider.onmove = function (e) {
        this.allowedDirections.forEach(function (dir) {
            this.scrollBars[dir].onscroll(e);
        }.bind(this));

        originalCallback(e);
    }.bind(this);
};

/**
 * disable scroll-bars
 */
TouchMove.prototype.disableScrollBars = function () {

    this.allowedDirections.forEach(function (dir) {
        this.scrollBars[dir].disable();
    }.bind(this));
};

/**
 * disable scroll-bars
 */
TouchMove.prototype.enableScrollBars = function () {

    this.allowedDirections.forEach(function (dir) {
        this.scrollBars[dir].enable();
    }.bind(this));
};

/**
 * init event names
 * @returns {TouchMove}
 */
TouchMove.prototype.initEvents = function () {

    if ("ontouchstart" in document) {

        this.startEvent = 'touchstart';
        this.moveEvent = 'touchmove';
        this.stopEvent = 'touchend';
    } else {

        this.startEvent = 'mousedown';
        this.moveEvent = 'mousemove';
        this.stopEvent = 'mouseup';
    }

    return this;
};

/**
 * apply events
 */
TouchMove.prototype.apply = function () {

    this.handlerDown = this.start.bind(this);
    this.handlerMove = this.move.bind(this);
    this.handlerUp = this.end.bind(this);
    this.slider.elem.addEventListener(this.startEvent, this.handlerDown);
};

/**
 * prepare animation start
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.prototype.start = function (e) {

    if (e instanceof MouseEvent) {
        e.preventDefault();
    }

    this.slider
        .resetStates()
        .resetTransition();
    this.setStartTime()
        .setStartPosition();

    this.eventStartPosition = this.getEventPosition(e);
    this.lastEventPosition = this.eventStartPosition;

    this.slider.elem.addEventListener(this.moveEvent, this.handlerMove);
    document.addEventListener(this.stopEvent, this.handlerUp);
};

/**
 * move slider
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.prototype.move = function (e) {

    e.preventDefault();
    this.preventEndEvent = true;

    var ePos = this.getEventPosition(e);

    if (this.isAllowedOrientation()) {
        requestAnimationFrame(this.slider.translate.bind(this.slider, {
            "x": this.isAllowedX() ? ePos.x - this.lastEventPosition.x : 0,
            "y": this.isAllowedY() ? ePos.y - this.lastEventPosition.y : 0
        }));
    }

    this.lastEventPosition = ePos;
};

/**
 * detach event listeners, store animation end parameters
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.prototype.end = function (e) {

    if (this.preventEndEvent) {
        if (e.cancelable) {
            e.preventDefault();
        }
        this.preventEndEvent = false;
    }

    this.slider.elem.removeEventListener(this.moveEvent, this.handlerMove);
    document.removeEventListener(this.stopEvent, this.handlerUp);
    this.setEndTime().setEndPosition().setSpeed();
};

/**
 * get event position
 * @param {TouchEvent|MouseEvent} e
 * @returns {*}
 */
TouchMove.prototype.getEventPosition = function (e) {

    if (e instanceof MouseEvent) {
        return {
            "x" : e.clientX,
            "y" : e.clientY
        };
    } else {
        return {
            "x" : e.changedTouches[0].clientX,
            "y" : e.changedTouches[0].clientY
        };
    }
};

/**
 * store start position
 * @returns {TouchMove}
 */
TouchMove.prototype.setStartPosition = function () {

    this.startPosition = this.slider.getState();
    return this;
};

/**
 * store end position
 * @returns {TouchMove}
 */
TouchMove.prototype.setEndPosition = function () {

    this.endPosition = this.slider.getState();
    return this;
};

/**
 * set timestamp of touch start
 * @returns {TouchMove}
 */
TouchMove.prototype.setStartTime = function () {

    this.startTime = performance.now();
    return this;
};
/**
 * set timestamp of touch end
 * @returns {TouchMove}
 */
TouchMove.prototype.setEndTime = function () {

    this.endTime = performance.now();
    return this;
};

/**
 * set overall speed
 * @returns {TouchMove}
 */
TouchMove.prototype.setSpeed = function () {

    var deltaT = (this.endTime - this.startTime) / 1000;

    this.sliderSpeed = {
        "x" : Math.abs(this.startPosition.x - this.endPosition.x) / deltaT,
        "y" : Math.abs(this.startPosition.y - this.endPosition.y) / deltaT
    };
    return this;
};

/**
 * determine is allowed horizontally
 * @returns {boolean}
 */
TouchMove.prototype.isAllowedX = function () {

    return this.allowedDirections.indexOf('x') > -1;
};

/**
 * determine is allowed vertically
 * @returns {boolean}
 */
TouchMove.prototype.isAllowedY = function () {

    return this.allowedDirections.indexOf('y') > -1;
};

/**
 * determine if current orientation is allowed
 * @returns {boolean}
 */
TouchMove.prototype.isAllowedOrientation = function () {

    return this.allowedOrientations.indexOf(this.getOrientation()) > -1;
};

/**
 * retrieve current device orientation
 * @returns {string}
 */
TouchMove.prototype.getOrientation = function () {

    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

/** Polyfills */

if ("undefined" === typeof window.performance) {
	window.performance = {
		"now" : function () {
			return Date.now();
		}
	}
}