/**
 * @typedef {Object} Pos
 * @var {Number} x
 * @var {Number} y
 */

/**
 * @typedef {{}} TouchSlide.MinMax
 * @var {Number} min
 * @var {Number} max
 */

/**
 * @typedef {Object} TouchSlide.Borders
 * @var {TouchSlide.MinMax} x
 * @var {TouchSlide.MinMax} y
 */

/**
 * @typedef {Object} TouchSlide.Tiles
 * @var {Number} x
 * @var {Number} y
 */

/**
 * @typedef {{}} TouchSlide.Options
 * @var {HTMLElement} slide
 * @var {String[]} [allowedOrientations]
 * @var {String[]} [allowedDirections]
 * @var {TouchSlide.Borders}
 * @var {Number} [maxDelta]
 * @var {TouchSlide.Tiles} [tiles]
 */


// @see: https://github.com/ariya/kinetic/

/**
 * @class
 * @param {TouchSlide.Options} options
 * @constructor
 */
VDRest.Lib.TouchSlide = function (options) {

    if (!options.slide) {
        throw new Error('No slide specified');
    }

    this.slide = options.slide;

    if (!options.borders) {
        throw new Error('No borders specified');
    }
    this.borders = options.borders;
    this.allowedOrientations = options.allowedOrientations || ['portrait', 'landscape'];
    this.allowedDirections = options.allowedDirections || ['x', 'y'];
    this.maxDelta = options.maxDelta || 30;
    this.tiles = options.tiles || {
        "x": 1,
        "y": 1
    };

    this.apply();
};

/**
 * apply touch slide
 */
VDRest.Lib.TouchSlide.prototype.apply = function () {

    this.initSlide();
    this.slide.addEventListener('touchstart', this.handleDown.bind(this));
};

/**
 * handle touch start
 * @param {Event} e
 */
VDRest.Lib.TouchSlide.prototype.handleDown = function (e) {

    if (this.isAllowedOrientation()) {

        this.resetTransition()
            .getStartPosition()
            .getTouchStart(e)
            .initStart();
    }
};

/**
 * handle touch move
 * @param {Event} e
 */
VDRest.Lib.TouchSlide.prototype.handleMove = function (e) {

    e.preventDefault();

    if (this.isAllowedOrientation()) {

        this.slide.style.transform = this.getTransformMove(e);
    }
};


/**
 * handle touch stop
 * @param {Event} e
 */
VDRest.Lib.TouchSlide.prototype.handleUp = function (e) {

    this.slide.removeEventListener('touchmove', this.handlerMove);
    this.slide.removeEventListener('touchend', this.handlerEnd);

    if (this.isAllowedOrientation() && this.canAnimate(e)) {

        this.slide.style.transform = this.getTransformEnd();
    }
};

/**
 * determine if current orientation is allowed
 * @returns {boolean}
 */
VDRest.Lib.TouchSlide.prototype.isAllowedOrientation = function () {

    return this.allowedOrientations.indexOf(this.getOrientation()) > -1;
};

/**
 * determine is allowed horizontally
 * @returns {boolean}
 */
VDRest.Lib.TouchSlide.prototype.isAllowedX = function () {

    return this.allowedDirections.indexOf('x') > -1;
};

/**
 * determine is allowed vertically
 * @returns {boolean}
 */
VDRest.Lib.TouchSlide.prototype.isAllowedY = function () {

    return this.allowedDirections.indexOf('y') > -1;
};

/**
 * determine current device orientation
 * @returns {string}
 */
VDRest.Lib.TouchSlide.prototype.getOrientation = function () {

    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

/**
 * reset transform transition
 * @returns {VDRest.Lib.TouchSlide}
 */
VDRest.Lib.TouchSlide.prototype.resetTransition = function () {

    this.slide.style.transition = 'transform 0s';
    return this;
};

/**
 * confirm if slide can animate to ending position
 * @param {Event} e
 * @returns {boolean}
 */
VDRest.Lib.TouchSlide.prototype.canAnimate = function (e) {

    this.getChanges(e).getCurrentPosition();

    return this.animateDelta.x != 0 && !isNaN(this.animateDelta.x);

};

/**
 * retrieve speed
 * @returns {VDRest.Lib.TouchSlide}
 */
VDRest.Lib.TouchSlide.prototype.getSpeed = function () {

    this.slideSpeed = Math.abs(this.animateDelta.x) / ((new Date().getTime() - this.animateStartTime) / 1000);
    return this;
};

/**
 * retrieve remaining animation duration
 * @returns {Number}
 */
VDRest.Lib.TouchSlide.prototype.getRemainDuration = function () {

    var deltaToEnd = this.tilesWidth - Math.abs(this.animateDelta.x),
        remainTime = deltaToEnd / this.slideSpeed;

    return remainTime > 1 ? 1 : remainTime;
};

/**
 * set slide end transition
 * @returns {VDRest.Lib.TouchSlide}
 */
VDRest.Lib.TouchSlide.prototype.setEndTransition = function () {

    this.slide.style.transition = 'transform ' + this.getRemainDuration() + 's ease-out';

    return this;
};

/**
 * set slide end transition
 * @returns {String}
 */
VDRest.Lib.TouchSlide.prototype.getTransformEnd = function () {

    this.getSpeed().setEndTransition();
    return 'translateX(' + this.getEndPos() + 'px)'
};

/**
 * retrieve end position // TODO: implement vertical
 *
 * wenn es nur eine Kachel gibt bzw. die Klasse als Scroller verwendet werden soll,
 * könnte die Ende Transformation berechnet werden aus einem Zeitraum, in dem sich der slide
 * maximal bewegen soll, abhängig vom Speed (sone art physik effekt)
 *
 * Testen beim einbaun ins epg :) Yeah!
 *
 *
 * @returns {Number}
 */
VDRest.Lib.TouchSlide.prototype.getEndPos = function () {

    var endPos;

    if ((this.slideSpeed < 350 && 100 * Math.abs(this.animateDelta.x) / this.tilesWidth < 25) || this.animateMaxed) {
        endPos = this.animateStartPosition.x;
        this.slide.style.transition = 'transform .3s ease-out';
    } else {

        if (this.directions.x == 'left') {
            endPos = this.animateStartPosition.x - this.tilesWidth;
            endPos = endPos <= this.ranges.x.min ? this.ranges.x.min : endPos;
        } else {
            endPos = this.animateStartPosition.x + this.tilesWidth;
            endPos = endPos >= 0 ? 0 : endPos;
        }
    }
    return endPos;
};

/**
 * retrieve css string
 * @returns {String}
 */
VDRest.Lib.TouchSlide.prototype.getTransformMove = function (e) {

    var newPos, transform = ['translateZ(0)'];

    this.getChanges(e).getCurrentPosition();
    newPos = this.getNewPos();

    if (this.isAllowedX()) {
        transform.push('translateX(' + newPos.x + 'px)');
    }
    if (this.isAllowedY()) {
        transform.push('translateY(' + newPos.x + 'px)');
    }

    return transform.join(' ');
};

/**
 * retrieve new position
 * @returns {Pos}
 */
VDRest.Lib.TouchSlide.prototype.getNewPos = function () {

    return {
        "x": this.validateNewX(
            this.animateStartPosition.x - this.animateDelta.x
        ),
        "y": this.validateNewY(
            this.animateStartPosition.y - this.animateDelta.y
        )
    };
};

/**
 * validate new x position
 * @param {Number} x
 * @returns {Number}
 */
VDRest.Lib.TouchSlide.prototype.validateNewX = function (x) {

    if (this.directions.x == 'left' && Math.abs(x) > this.ranges.x.max) {
        if (Math.abs(x) - this.ranges.x.max > this.maxDelta) {
            x = this.currentPos.x;
            this.animateMaxed = true;
        }
    } else if (x > 0 && x > this.maxDelta) {
        x = this.currentPos.x;
        this.animateMaxed = true;
    }

    return x;
};

/**
 * validate new y position (dummy) TODO: implement
 * @param {Number} y
 * @returns {Number}
 */
VDRest.Lib.TouchSlide.prototype.validateNewY = function (y) {

    //if (this.directions.x == 'left' && Math.abs(x) > this.ranges.x.max) {
    //    if (Math.abs(x) - this.ranges.x.max > this.maxDelta) {
    //        x = this.currentPos.x;
    //        this.animateMaxed = true;
    //    }
    //} else if (x > 0 && x > this.maxDelta) {
    //    x = this.currentPos.x;
    //    this.animateMaxed = true;
    //} else {
    //    x = this.animateDelta.x + this.animateStartPosition.x;
    //}

    return y;
};

/**
 * retrieve changes
 * @param {Event} e
 */
VDRest.Lib.TouchSlide.prototype.getChanges = function (e) {

    this.getDelta(e).getDirection();
    return this;
};

/**
 * compute delta
 * @param {Event} e
 */
VDRest.Lib.TouchSlide.prototype.getDelta = function (e) {

    var touchChange = this.getCurrentTouch(e);

    this.animateDelta = {
        "x": this.touchStart.x - touchChange.x,
        "y": this.touchStart.y - touchChange.y
    };
    return this;
};

/**
 * determine direction
 */
VDRest.Lib.TouchSlide.prototype.getDirection = function () {

    this.directions = {
        "x": this.animateDelta.x > 0 ? 'left' : 'right',
        "y": this.animateDelta.y > 0 ? 'up' : 'down'
    };
    return this;
};

/**
 * determine start position
 * @returns {VDRest.Lib.TouchSlide}
 */
VDRest.Lib.TouchSlide.prototype.getStartPosition = function () {

    var transform = this.slide.style.transform, pos = {};
    pos.x = transform ? parseInt(transform.replace(/.*translateX\(([^)]*)px.*/, "$1"), 10) : 0;
    pos.y = transform ? parseInt(transform.replace(/.*translateY\(([^)]*)px.*/, "$1"), 10) : 0;
    pos.x = isNaN(pos.x) ? 0 : pos.x;
    pos.y = isNaN(pos.y) ? 0 : pos.y;
    this.animateStartPosition = pos;
    return this;
};

/**
 * determine current position
 * @returns {VDRest.Lib.TouchSlide}
 */
VDRest.Lib.TouchSlide.prototype.getCurrentPosition = function () {

    var transform = this.slide.style.transform;
    this.currentPos = {
        "x": transform ? parseInt(transform.replace(/.*translateX\(([^)]*)px.*/, "$1"), 10) : 0,
        "y": transform ? parseInt(transform.replace(/.*translateY\(([^)]*)px.*/, "$1"), 10) : 0
    };
    this.currentPos.x = isNaN(this.currentPos.x) ? 0 : this.currentPos.x;
    this.currentPos.y = isNaN(this.currentPos.y) ? 0 : this.currentPos.y;

    return this;
};

/**
 * init slider
 * @returns {VDRest.Lib.TouchSlide}
 */
VDRest.Lib.TouchSlide.prototype.initSlide = function () {

    this.slide.style.backfaceVisibility = 'hidden';
    this.slide.style.perspective = '1000px';

    return this;
};

/**
 * prepare for start moving
 * @returns {VDRest.Lib.TouchSlide}
 */
VDRest.Lib.TouchSlide.prototype.initStart = function () {

    this.animateMaxed = false;
    this.animateStartTime = new Date().getTime();

    this.handlerMove = this.handleMove.bind(this);
    this.handlerEnd = this.handleUp.bind(this);

    this.getRanges();
    this.tilesWidth = this.ranges.x.range / this.tiles.x;
    //this.tilesHeight = this.ranges.y.range / this.tiles.y;

    this.slide.addEventListener('touchmove', this.handlerMove);
    this.slide.addEventListener('touchend', this.handlerEnd);

    return this;
};

/**
 * determine maximum range
 * @returns {VDRest.Lib.TouchSlide}
 */
VDRest.Lib.TouchSlide.prototype.getRanges = function () {

    var minX = "function" === typeof this.borders.x.min ? this.borders.x.min() : this.borders.x.min,
        maxX = "function" === typeof this.borders.x.max ? this.borders.x.max() : this.borders.x.max,
        minY = "function" === typeof this.borders.y.min ? this.borders.y.min() : this.borders.y.min,
        maxY = "function" === typeof this.borders.y.max ? this.borders.y.max() : this.borders.y.max;


    this.ranges = {
        "x": {
            "min": minX,
            "max": maxX,
            "range": maxX - minX
        },
        "y": {
            "min": minY,
            "max": maxY,
            "range": maxY - minY
        }
    };

    return this;
};

/**
 * determine first touch position
 * @param {Event} e
 * @returns {VDRest.Lib.TouchSlide}
 */
VDRest.Lib.TouchSlide.prototype.getTouchStart = function (e) {

    this.touchStart = {
        "x": parseInt(e.touches[0].clientX, 10),
        "y": parseInt(e.touches[0].clientY, 10)
    };
    return this;
};

/**
 * determine first touch position
 * @param {Event} e
 * @returns {Pos}
 */
VDRest.Lib.TouchSlide.prototype.getCurrentTouch = function (e) {

    return {
        "x": parseInt(e.changedTouches[0].clientX, 10),
        "y": parseInt(e.changedTouches[0].clientY, 10)
    };
};
