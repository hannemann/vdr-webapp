/**
 * @class
 * @param {TouchMove.Options} [options]
 * @constructor
 */
TouchMove.Slide = function (options) {

	if (!options) return;

    TouchMove.prototype.init.call(this, options);
};

/**
 * @type {TouchMove}
 */
TouchMove.Slide.prototype = new TouchMove();

/**
 * determine and apply axis and allowed directions
 * @returns {TouchMove.Slide}
 */
TouchMove.Slide.prototype.setAxis = function () {

    this.axis = this.slider.isHorizontal() ?  'x' : 'y';
    this.allowedDirections = [this.axis];

    return this;
};

TouchMove.Slide.prototype.start = function (e) {

    this.setAxis().setDimSlide();
    TouchMove.prototype.start.call(this, e);
};

/**
 * set tile and slider dimensions
 * @returns {TouchMove.Slide}
 */
TouchMove.Slide.prototype.setDimSlide = function () {

    this.dimTile = this.tiles['getTile' + ('x' === this.axis ? 'Width' : 'Height')]();
    this.dimSlide = this.dimTile * this.tiles.length;
    if (this.isAllowedOrientation() && this.slider.getWidth() !== this.dimSlide) {
        this.slider['set' + ('x' === this.axis ? 'Width' : 'Height')](this.dimSlide);
    }

    return this;
};

/**
 * determine if slider is in rest state
 * @returns {boolean}
 */
TouchMove.Slide.prototype.hasEnded = function () {

    var state = this.slider.getState(),
        begin = state[this.axis] === 0,
        end = state[this.axis] === -(this.dimSlide - this.dimTile),
        snapped = Math.abs(state.x) % this.dimTile === 0;

    return begin || end || snapped;
};

/**
 * handle touch start
 * @param {Event} e
 */
TouchMove.Slide.prototype.start = function (e) {

	this.setDimSlide();
	TouchMove.prototype.start.call(this, e);
};

/**
 * handle touch stop
 * @param {Event} e
 */
TouchMove.Slide.prototype.end = function (e) {

	TouchMove.prototype.end.call(this, e);
	this.setEndTransition();
	requestAnimationFrame(this.getTransformEnd.bind(this));
};

/**
 * store start position
 * @returns {TouchMove}
 */
TouchMove.Slide.prototype.setStartPosition = function () {

    if (this.hasEnded()) {
        this.startPosition = this.slider.getState();
    }
    return this;
};

/**
 * retrieve remaining animation duration
 * @returns {Number}
 */
TouchMove.Slide.prototype.getRemainDuration = function () {

    var deltaToEnd = this.dimTile - Math.abs(this.startPosition[this.axis] - this.endPosition[this.axis]),
        remainTime = deltaToEnd / this.sliderSpeed[this.axis];

    return remainTime > 1 ? 1 : remainTime;
};

/**
 * set slide end transition
 * @returns {TouchMove.Slide}
 */
TouchMove.Slide.prototype.setEndTransition = function () {

    this.slider.setTransition(this.slider.prefix + 'transform ' + this.getRemainDuration() + 's ease-out');

    return this;
};

/**
 * set slide end transition
 * @returns {String}
 */
TouchMove.Slide.prototype.getTransformEnd = function () {

    var end = this.getEndPos();
    this.slider.elem.style[this.slider.jsStyle] =  'translate3d(' + end.x + 'px, ' + end.y + 'px, ' + end.z + 'px)'
};

/**
 * retrieve end position
 * @returns {{x: Number, y: Number, z: Number}}
 */
TouchMove.Slide.prototype.getEndPos = function () {

    var endPos = {
            "x" : this.startPosition.x,
            "y" : this.startPosition.y,
            "z" : 0
        },
        dir = this.axis == 'x' ? 'left' : 'up';

    if ((this.sliderSpeed[this.axis] < 350 && 100 * Math.abs(this.startPosition[this.axis] - this.endPosition[this.axis]) / this.dimTile < 25) || this.animateMaxed) {
        endPos[this.axis] = this.startPosition[this.axis];
        this.slider.setTransition(this.slider.prefix + 'transform .3s ease-out');
    } else {

        if (this.slider.scrollDirections[this.axis] == dir) {
            endPos[this.axis] = Math.ceil((this.endPosition[this.axis] - this.dimTile) / this.dimTile) * this.dimTile;
            endPos[this.axis] = endPos[this.axis] <= this.slider.min[this.axis] ? this.slider.min[this.axis] : endPos[this.axis];
        } else {
            endPos[this.axis] = Math.floor((this.endPosition[this.axis] + this.dimTile) / this.dimTile) * this.dimTile;
            endPos[this.axis] = endPos[this.axis] >= 0 ? 0 : endPos[this.axis];
        }
    }
    return endPos;
};
