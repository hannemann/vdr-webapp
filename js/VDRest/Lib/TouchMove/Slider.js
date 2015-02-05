/**
 * Slide
 * @param {HTMLElement} elem
 * @param {HTMLElement} wrapper
 * @param {Function} [onmove]
 * @constructor
 */
TouchMove.Slider = function (elem, wrapper, onmove) {

	var state;

    if (!elem) {
        throw new Error('Could not find slider');
    }

    this.elem = elem;
	this.getVendorPrefix();
    this.wrapper = wrapper;
    this.onmove = onmove;
    this.setDimensions()
        .resetTransition()
        .resetStates()
        .hideBackface()
        .setPerspective()
    ;

	state = this.getState();
	if(state.x === 0 && state.y === 0) {
		this.resetTransform();
	}
};

TouchMove.Slider.prototype.getVendorPrefix = function () {
    
    var o = TouchMove.Helper.getTransformVendorPrefix(this.elem);

    this.prefix = o.prefix;
    this.jsStyle = o.jsStyle;
};

/**
 * compute and set min values
 * @returns {Boolean}
 */
TouchMove.Slider.prototype.isHorizontal = function () {

    return getComputedStyle(this.elem.querySelector('div')).getPropertyValue('float') === 'left';
};

/**
 * compute and set min values
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.setDimensions = function () {

    this.min = {
        "x": this.wrapper.clientWidth - this.elem.offsetWidth,
        "y": this.wrapper.clientHeight - this.elem.offsetHeight
    };

    return this;
};

/**
 * set width of slide
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.setWidth = function (width) {

    this.elem.style.width = width + 'px';

    return this;
};

/**
 * set height of slide
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.setHeight = function (height) {

    this.elem.style.height = height + 'px';

    return this;
};

/**
 * apply hidden back face visibility to improve performance
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.hideBackface = function () {

    this.elem.style.backfaceVisibility = 'hidden';
    return this;
};

/**
 * apply default perspective to improve performance
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.setPerspective = function () {

    this.elem.style.perspective = '1000px';
    return this;
};

/**
 * apply default matrix
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.resetTransform = function () {

    this.elem.style[this.jsStyle] = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
    return this;
};

/**
 * reset transform transition
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.resetTransition = function () {

	this.setTransition(this.prefix + 'transform 0s linear');
    return this;
};

/**
 * set transform transition
 * @param {String} transition
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.setTransition = function (transition) {

    this.elem.style.transition = transition;
    return this;
};

/**
 * read transform style property
 * @returns {string}
 */
TouchMove.Slider.prototype.getTransform = function () {

	var transform = window.getComputedStyle(this.elem).getPropertyValue(this.prefix + 'transform');

	if ("none" === transform) {
		this.resetTransform();
		transform = window.getComputedStyle(this.elem).getPropertyValue(this.prefix + 'transform');
	}
	return transform;
};

/**
 * retrieve current state
 * @returns {{x: Number, y: Number, tick: DOMHighResTimeStamp}}
 */
TouchMove.Slider.prototype.getState = function () {

    var posX = 4, posY = 5, matrix = this.getTransform();

    if (this.is3dMatrix(matrix)) {
        posX = 12;
        posY = 13
    }

    matrix = matrix.replace('matrix3d', '').replace(/[^0-9.,-]/g, '').split(',');

    return this.createState({
        "x": parseFloat(matrix[posX]),
        "y": parseFloat(matrix[posY])
    });
};

/**
 * retrieve state object
 * @param pos
 * @returns {{x: Number, y: Number, tick: DOMHighResTimeStamp}}
 */
TouchMove.Slider.prototype.createState = function (pos) {

    return {
        "x" : pos.x,
        "y" : pos.y,
        "tick" : performance.now()
    }
};

/**
 * save state
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.saveState = function (state) {

    state = state || this.getState();

    this.states.push(state);

    return this;
};

/**
 * reset states array
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.resetStates = function () {

    this.states = [this.getState()];

    return this;
};

/**
 * determine if matrix is 3d
 * @param {String} matrix
 * @returns {boolean}
 */
TouchMove.Slider.prototype.is3dMatrix = function (matrix) {
    return matrix.indexOf('matrix3d') > -1;
};

/**
 * translate position
 * @param {{x: Number, y: Number}} delta
 */
TouchMove.Slider.prototype.translate = function (delta) {

    var next = this.getNext(delta);

    this.elem.style[this.jsStyle] = 'translate3d(' + next.x + 'px, ' + next.y + 'px, 0)';

    this.saveState(this.createState(next));
    this.fireCallbacks(next);
};

/**
 * @param {{x: Number, y: Number}} next
 */
TouchMove.Slider.prototype.fireCallbacks = function (next) {

    next.prefix = this.prefix;
    next.jsStyle = this.jsStyle;

    if ("function" === typeof this.onmove) this.onmove(next);
    if ("function" === typeof this.onscrollend && this.reachedEnd(next)) this.onscrollend();
};

/**
 * calculate next position
 * @param {{x: Number, y: Number}} delta
 * @returns {{x: Number, y: Number}}
 */
TouchMove.Slider.prototype.getNext = function (delta) {

    var state = this.getState();

    this.setDimensions().setDirections(delta);

    return {
        "x": this.getOutOfBoundsX(state.x + delta.x),
        "y": this.getOutOfBoundsY(state.y + delta.y)
    };
};

/**
 * determine if end position has been reached
 * @param {{x: Number, y: Number}} pos
 * @returns {boolean}
 */
TouchMove.Slider.prototype.reachedEnd = function (pos) {

    var endLeft = (pos.x == 0 && (pos.y == 0 || pos.y == this.min.y)),
        endRight = (pos.x == this.min.x && (pos.y == 0 || pos.y == this.min.y));

    return endLeft || endRight;
};

/**
 * @param {{x: Number, y: Number}} delta
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.setDirections = function (delta) {

    this.scrollDirections = {
        "x": delta.x > 0 ? "right" : "left",
        "y": delta.y > 0 ? "down" : "up"
    };

    return this;
};

/**
 * determine if posX is out of bounds
 * @param {Number} posX
 * @returns {Number}
 */
TouchMove.Slider.prototype.getOutOfBoundsX = function (posX) {

    if (posX === 0 || posX === this.min.x) {
        return posX;
    }

    if (this.scrollDirections.x === 'right' && posX >= 0) {
        return 0;
    } else if (this.scrollDirections.x === 'left' && posX <= this.min.x) {
        return this.min.x;
    }
    return posX;
};

/**
 * determine if posY is out of bounds
 * @param {Number} posY
 * @returns {Number}
 */
TouchMove.Slider.prototype.getOutOfBoundsY = function (posY) {

    if (posY === 0 || posY === this.min.y) {
        return posY;
    }

    if (this.scrollDirections.y === 'down' && posY >= 0) {
        return 0;
    } else if (this.scrollDirections.y === 'up' && posY <= this.min.y) {
        return this.min.y;
    }
    return posY;
};
