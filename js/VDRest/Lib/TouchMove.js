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
    this.slide = new TouchMove.Slide(this.scroller.querySelector('.slide'), this.scroller, options.onmove);
    this.tiles = new TouchMove.Tiles(this.slide);
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
 * save start state
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.prototype.start = function (e) {

    this.slide.resetTransition();
    this.setStartTime()
        .setStartPosition();

    this.eventStartPosition = this.getEventPosition(e);
    this.lastEventPosition = this.eventStartPosition;

    this.slide.elem.addEventListener(this.moveEvent, this.handlerMove);
    document.addEventListener(this.stopEvent, this.handlerUp);
};

/**
 * save start state
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.prototype.move = function (e) {

    var ePos = this.getEventPosition(e);

    this.slide.translate({
        "x": this.isAllowedX() ? ePos.x - this.lastEventPosition.x : 0,
        "y": this.isAllowedY() ? ePos.y - this.lastEventPosition.y : 0
    });

    this.lastEventPosition = ePos;
};

TouchMove.prototype.end = function () {

    this.slide.elem.removeEventListener(this.moveEvent, this.handlerMove);
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

    this.startPosition = this.slide.getTranslate(true);
    return this;
};

/**
 * determine start position
 * @returns {TouchMove}
 */
TouchMove.prototype.setEndPosition = function () {

    this.endPosition = this.slide.getTranslate(true);
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

    this.slideSpeed = {
        "x" : Math.abs(this.startPosition.x - this.endPosition.x) / deltaT,
        "y" : Math.abs(this.startPosition.y - this.endPosition.y) / deltaT
    };
    return this;
};

/**
 * determine if current orientation is allowed
 * @returns {boolean}
 */
TouchMove.prototype.isAllowedOrientation = function () {

    return this.allowedOrientations.indexOf(this.getOrientation()) > -1;
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
 * determine current device orientation
 * @returns {string}
 */
TouchMove.prototype.getOrientation = function () {

    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};


/********************************* Slide *************************************/


/**
 * Slide
 * @param {HTMLElement} elem
 * @param {HTMLElement} wrapper
 * @param {Function} [onmove]
 * @constructor
 */
TouchMove.Slide = function (elem, wrapper, onmove) {
    this.elem = elem;
    this.wrapper = wrapper;
    this.callback = onmove;
    this.setDimensions()
        .resetTransform()
        .resetTransition()
        .hideBackface()
        .setPerspective()
    ;
};

/**
 * compute and apply necessary width of slide
 * @returns {TouchMove.Slide}
 */
TouchMove.Slide.prototype.setDimensions = function () {

    this.min = {
        "x" : this.wrapper.clientWidth - this.elem.offsetWidth,
        "y" : this.wrapper.clientHeight - this.elem.offsetHeight
    };

    return this;
};

/**
 * apply default matrix
 * @returns {TouchMove.Slide}
 */
TouchMove.Slide.prototype.hideBackface = function () {

    this.elem.style.backfaceVisibility = 'hidden';
    this.elem.style.perspective = '1000px';
    return this;
};

/**
 * apply default matrix
 * @returns {TouchMove.Slide}
 */
TouchMove.Slide.prototype.setPerspective = function () {

    this.elem.style.perspective = '1000px';
    return this;
};

/**
 * apply default matrix
 * @returns {TouchMove.Slide}
 */
TouchMove.Slide.prototype.resetTransform = function () {

    this.elem.style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
    return this;
};

/**
 * reset transform transition
 * @returns {TouchMove.Slide}
 */
TouchMove.Slide.prototype.resetTransition = function () {

    this.elem.style.transition = 'transform 0s';
    return this;
};

/**
 * read transform style property
 * @returns {string}
 */
TouchMove.Slide.prototype.getTransform = function () {

    return window.getComputedStyle(this.elem).getPropertyValue('transform');
};

/**
 * get translation
 * @param {Boolean} update shall update data?
 * @returns {{x: Number, y: Number}}
 */
TouchMove.Slide.prototype.getTranslate = function (update) {

    var posX = 4, posY = 5, matrix = this.getTransform(), current;

    if (this.is3dMatrix(matrix)) {
        posX = 12; posY = 13
    }

    matrix = matrix.replace(/[^0-9.,-]/g, '').split(',');

    current = {
        "x"   : parseFloat(matrix[posX]),
        "y"   : parseFloat(matrix[posY])
    };

    if (update) {

        this.current = current
    }

    return current;
};

/**
 * determine if matrix is 3d
 * @param {String} matrix
 * @returns {boolean}
 */
TouchMove.Slide.prototype.is3dMatrix = function (matrix) {
    return matrix.indexOf('matrix3d') > -1;
};

/**
 * translate position
 * @param {{x: Number, y: Number}} delta
 */
TouchMove.Slide.prototype.translate = function (delta) {

    var next = this.getNext(delta);

    this.elem.style.transform = 'translate(' + next.x + 'px, ' + next.y + 'px) translateZ(0)';

    this.current = next;

    if ("function" === typeof this.callback) {
        this.callback(next);
    }
};

TouchMove.Slide.prototype.getNext = function (delta) {

    var nextX, nextY, maxX = false, minX = false, maxY = false, minY = false;

    this.scrollDirection = {
        "x" : delta.x > 0 ? "right" : "left",
        "y" : delta.y > 0 ? "down" : "up"
    };

    nextX = this.current.x + delta.x;
    nextY = this.current.y + delta.y;

    this.setDimensions();

    if (this.scrollDirection.x === 'right' && nextX >= 0) {
        nextX = 0;
        maxX = true;
    } else if (this.scrollDirection.x === 'left' && nextX <= this.min.x) {
        nextX = this.min.x;
        minX = true;
    }

    if (this.scrollDirection.y === 'down' && nextY >= 0) {
        nextY = 0;
        maxY = true;
    } else if (this.scrollDirection.y === 'up' && nextY <= this.min.y) {
        nextY = this.min.y;
        minY = true;
    }

    if (maxX && (minY || maxY) || minX && (maxY || minY)) {
        console.log('Maxed!');
        if ("function" === typeof this.onscrollend) {
            this.onscrollend();
        }
    }

    return {
        "x" : nextX,
        "y" : nextY
    };
};



/******************************************** Tiles *************************************/

/**
 * @param {TouchMove.Slide} slide
 * @constructor
 */
TouchMove.Tiles = function (slide) {
    this.tiles = slide.elem.querySelectorAll('div');
};

/**
 * retrieve sum of tiles width and margins
 * @returns {number}
 */
TouchMove.Tiles.prototype.getWidth = function () {
    var width = 0;
    Array.prototype.forEach.call(this.tiles, function (tile) {
        var s = getComputedStyle(tile),
            m = parseInt(s.getPropertyValue('margin-left'), 10) + parseInt(s.getPropertyValue('margin-right'), 10);

        width += m + tile.offsetWidth;
    });

    return width;
};