/**
 * @class
 * @param {TouchMove.Options} options
 * @constructor
 */
TouchMove.Scroll = function (options) {
    TouchMove.prototype.init.call(this, options);
    this.apply();
};

/**
 * @type {TouchMove}
 */
TouchMove.Scroll.prototype = new TouchMove();

/**
 * @type {number}
 */
TouchMove.Scroll.prototype.timeConstant = 325;

/**
 * @type {number}
 */
TouchMove.Scroll.prototype.friction = 0.8;

/**
 * handle start
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.Scroll.prototype.start = function (e) {

    this.slider.getTranslate(true);
    this.clearEasing().resetState();
    TouchMove.prototype.start.call(this, e);
};

/**
 * handle move
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.Scroll.prototype.move = function (e) {

    this.calculateVelocity();
    TouchMove.prototype.move.call(this, e);
};

/**
 * handle end
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.Scroll.prototype.end = function (e) {

    TouchMove.prototype.end.call(this, e);
    this.calculateVelocity()
        .calculateAmplitude()
        .easeOut();
};

/**
 * reset calculation values
 */
TouchMove.Scroll.prototype.resetState = function () {

    this.lastState = this.slider.current;
    this.timestamp = Date.now();
    this.velocity = {
        "x": 0,
        "y": 0
    };
};

/**
 * decelerate scrolling until speed is 0
 */
TouchMove.Scroll.prototype.easeOut = function () {
    this.clearEasing();

    this.slider.onscrollend = function () {
        this.clearEasing();
    }.bind(this);

    if (this.velocity.x > 10 || this.velocity.x < -10 || this.velocity.y > 10 || this.velocity.y < -10) {

        this.easeInterval = setInterval(this.stepEasing.bind(this), 1000 / this.fps);
    }

};

/**
 * calculate delta and call slider translate
 */
TouchMove.Scroll.prototype.stepEasing = function () {

    var delta, elapsed;

    elapsed = Date.now() - this.endTime;

    delta = {
        "x": this.amplitude.x * Math.exp(-elapsed / this.timeConstant),
        "y": this.amplitude.y * Math.exp(-elapsed / this.timeConstant)
    };

    if (delta.x < 0.5 && delta.y < 0.5) {
        this.clearEasing();
    } else {
        delta.x *= this.slider.scrollDirection.x == "right" ? 1 : -1;
        delta.y *= this.slider.scrollDirection.y == "down" ? 1 : -1;
        this.slider.translate(delta);
    }

};

/**
 * clear easing interval
 */
TouchMove.Scroll.prototype.clearEasing = function () {

    if ("undefined" !== this.easeInterval) {
        clearInterval(this.easeInterval);
        this.easeInterval = undefined;
    }
    return this;
};

/**
 * calculate average velocity
 * @returns {TouchMove.Scroll}
 */
TouchMove.Scroll.prototype.calculateVelocity = function () {

    var now = Date.now(),
        elapsed = now - this.timestamp,
        vx, vy,
        delta = {
            "x": Math.abs(this.lastState.x - this.slider.current.x),
            "y": Math.abs(this.lastState.y - this.slider.current.y)
        };

    this.timestamp = now;
    this.lastState = this.slider.current;

    vx = (1000 / this.fps) * delta.x / (1 + elapsed);
    vy = (1000 / this.fps) * delta.y / (1 + elapsed);

    this.velocity.x = .8 * vx + .2 * this.velocity.x;
    this.velocity.y = .8 * vy + .2 * this.velocity.y;

    return this;
};

/**
 * calculate amplitude
 * @returns {TouchMove.Scroll}
 */
TouchMove.Scroll.prototype.calculateAmplitude = function () {

    this.amplitude = {
        "x": this.velocity.x * this.friction,
        "y": this.velocity.y * this.friction
    };

    return this;
};
