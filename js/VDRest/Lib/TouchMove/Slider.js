/**
 * Slide
 * @param {HTMLElement} elem
 * @param {HTMLElement} wrapper
 * @param {Function} [onmove]
 * @constructor
 */
TouchMove.Slider = function (elem, wrapper, onmove) {
    this.elem = elem;
    this.wrapper = wrapper;
    this.onmove = onmove;
    this.setDimensions()
        .resetTransform()
        .resetTransition()
        .hideBackface()
        .setPerspective()
    ;
};

/**
 * compute and apply necessary width of slide
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

    this.elem.style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
    return this;
};

/**
 * reset transform transition
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.resetTransition = function () {

    this.elem.style.transition = 'transform 0s linear';
    return this;
};

/**
 * read transform style property
 * @returns {string}
 */
TouchMove.Slider.prototype.getTransform = function () {

    return window.getComputedStyle(this.elem).getPropertyValue('transform');
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

    this.elem.style.transform = 'translate(' + next.x + 'px, ' + next.y + 'px) translateZ(0)';

    this.saveState(this.createState(next));
    this.fireCallbacks(next);
};

/**
 * @param {{x: Number, y: Number}} next
 */
TouchMove.Slider.prototype.fireCallbacks = function (next) {

    if ("function" === typeof this.onmove) this.onmove(next);
    if ("function" === typeof this.onscrollend && this.reachedEnd(next)) this.onscrollend();
};

/**
 * calculate next position
 * @param {{x: Number, y: Number}} delta
 * @returns {{x: Number, y: Number}}
 */
TouchMove.Slider.prototype.getNext = function (delta) {

    this.setDimensions().setDirections(delta);

    return {
        "x": this.getOutOfBoundsX(this.states[this.states.length - 1].x + delta.x),
        "y": this.getOutOfBoundsY(this.states[this.states.length - 1].y + delta.y)
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

    if (this.scrollDirections.y === 'down' && posY >= 0) {
        return 0;
    } else if (this.scrollDirections.y === 'up' && posY <= this.min.y) {
        return this.min.y;
    }
    return posY;
};
