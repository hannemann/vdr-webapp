/**
 * @typedef {{}} TouchMove.Options
 * @var {HTMLElement} scroller
 * @var {HTMLElement} slider
 * @var {TouchMove.Tiles} [tiles]
 * @var {String[]} [allowedOrientations]
 * @var {String[]} [allowedDirections]
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

    this.initEvents();
    this.scroller = options.scroller;
    this.slider = new TouchMove.Slider(this.scroller.querySelector('.slide'), this.scroller, options.onmove);
    this.tiles = new TouchMove.Tiles(this.slider);
    this.allowedOrientations = options.allowedOrientations || ['portrait', 'landscape'];
    this.allowedDirections = options.allowedDirections || ['x', 'y'];
    this.apply();
};

/**
 * init event names
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
 */
TouchMove.prototype.end = function () {

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

    if (e instanceof TouchEvent) {

        return {
            "x" : e.changedTouches[0].clientX,
            "y" : e.changedTouches[0].clientY
        };
    } else {
        return {
            "x" : e.x,
            "y" : e.y
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
