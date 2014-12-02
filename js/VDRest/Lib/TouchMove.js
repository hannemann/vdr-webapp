/**
 * @typedef {{}} TouchMove.Options
 * @var {HTMLElement} slide
 * @var {String[]} [allowedOrientations]
 * @var {String[]} [allowedDirections]
 * @var {TouchSlide.Borders}
 * @var {Number} [maxDelta]
 * @var {TouchSlide.Tiles} [tiles]
 */


/**
 * @class
 * @constructor
 */
TouchMove = function () {};

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
};

/**
 * frames per second
 */
TouchMove.prototype.fps = 60;

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
 * apply
 */
TouchMove.prototype.apply = function () {

    this.handlerDown = this.start.bind(this);
    this.handlerMove = this.move.bind(this);
    this.handlerUp = this.end.bind(this);
    this.slider.elem.addEventListener(this.startEvent, this.handlerDown);
};

/**
 * save start state
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.prototype.start = function (e) {

    this.slider.resetTransition();
    this.setStartTime()
        .setStartPosition();

    this.eventStartPosition = this.getEventPosition(e);
    this.lastEventPosition = this.eventStartPosition;

    this.slider.elem.addEventListener(this.moveEvent, this.handlerMove);
    document.addEventListener(this.stopEvent, this.handlerUp);
};

/**
 * save start state
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.prototype.move = function (e) {

    var ePos = this.getEventPosition(e);

    this.slider.translate({
        "x": this.isAllowedX() ? ePos.x - this.lastEventPosition.x : 0,
        "y": this.isAllowedY() ? ePos.y - this.lastEventPosition.y : 0
    });

    this.lastEventPosition = ePos;
};

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
 * determine start position
 * @returns {TouchMove}
 */
TouchMove.prototype.setStartPosition = function () {

    this.startPosition = this.slider.getTranslate(true);
    return this;
};

/**
 * determine start position
 * @returns {TouchMove}
 */
TouchMove.prototype.setEndPosition = function () {

    this.endPosition = this.slider.getTranslate(true);
    return this;
};

/**
 * set timestamp of touchstart
 * @returns {TouchMove}
 */
TouchMove.prototype.setStartTime = function () {

    this.startTime = new Date().getTime();
    return this;
};
/**
 * set timestamp of touchstart
 * @returns {TouchMove}
 */
TouchMove.prototype.setEndTime = function () {

    this.endTime = new Date().getTime();
    return this;
};

/**
 * retrieve speed
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
 * determine current device orientation
 * @returns {string}
 */
TouchMove.prototype.getOrientation = function () {

    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};
