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
 * apply default matrix
 * @returns {TouchMove.Slider}
 */
TouchMove.Slider.prototype.hideBackface = function () {

    this.elem.style.backfaceVisibility = 'hidden';
    return this;
};

/**
 * apply default matrix
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

    this.elem.style.transition = 'transform 0s';
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
 * get translation
 * @param {Boolean} update shall update data?
 * @returns {{x: Number, y: Number}}
 */
TouchMove.Slider.prototype.getTranslate = function (update) {

    var posX = 4, posY = 5, matrix = this.getTransform(), current;

    if (this.is3dMatrix(matrix)) {
        posX = 12;
        posY = 13
    }

    matrix = matrix.replace(/[^0-9.,-]/g, '').split(',');

    current = {
        "x": parseFloat(matrix[posX]),
        "y": parseFloat(matrix[posY])
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

    this.current = next;

    if ("function" === typeof this.callback) {
        this.callback(next);
    }
};

/**
 * calculate next position
 * @param {{x: Number, y: Number}} delta
 * @returns {{x: Number, y: Number}}
 */
TouchMove.Slider.prototype.getNext = function (delta) {

    var nextX, nextY;

    this.scrollDirection = {
        "x": delta.x > 0 ? "right" : "left",
        "y": delta.y > 0 ? "down" : "up"
    };

    nextX = this.current.x + delta.x;
    nextY = this.current.y + delta.y;

    this.setDimensions();

    if (this.scrollDirection.x === 'right' && nextX >= 0) {
        nextX = 0;
    } else if (this.scrollDirection.x === 'left' && nextX <= this.min.x) {
        nextX = this.min.x;
    }

    if (this.scrollDirection.y === 'down' && nextY >= 0) {
        nextY = 0;
    } else if (this.scrollDirection.y === 'up' && nextY <= this.min.y) {
        nextY = this.min.y;
    }

    if (nextX == 0 && (nextY == 0 || nextY == this.min.y) || nextX == this.min.x && (nextY == 0 || nextY == this.min.y)) {
        if ("function" === typeof this.onscrollend) {
            this.onscrollend();
        }
    }

    return {
        "x": nextX,
        "y": nextY
    };
};