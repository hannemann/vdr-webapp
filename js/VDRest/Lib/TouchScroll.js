/**
 * @class
 * @param {TouchMove.Options} options
 * @constructor
 */
TouchScroll = function (options) {
    TouchMove.prototype.init.call(this, options);
    this.apply();
};

/**
 * @type {TouchMove}
 */
TouchScroll.prototype = new TouchMove();

TouchScroll.prototype.timeConstant = 325;

TouchScroll.prototype.friction = 0.8;

/**
 * apply
 */
TouchScroll.prototype.apply = function () {

    this.handlerDown = this.start.bind(this);
    this.handlerMove = this.move.bind(this);
    this.handlerUp = this.end.bind(this);
    this.slide.elem.addEventListener(this.startEvent, this.handlerDown);
};

/**
 * handle start
 * @param {TouchEvent|MouseEvent} e
 */
TouchScroll.prototype.start = function (e) {

    this.slide.getTranslate(true);
    this.clearEasing().resetState();
    TouchMove.prototype.start.call(this, e);
};

/**
 * handle move
 * @param {TouchEvent|MouseEvent} e
 */
TouchScroll.prototype.move = function (e) {

    this.calculateVelocity();
    TouchMove.prototype.move.call(this, e);
};

/**
 * handle end
 * @param {TouchEvent|MouseEvent} e
 */
TouchScroll.prototype.end = function (e) {

    TouchMove.prototype.end.call(this, e);
    this.calculateVelocity()
        .calculateAmplitude()
        .easeOut();
};

TouchScroll.prototype.resetState = function () {

    this.lastState = this.slide.current;
    this.timestamp = Date.now();
    this.velocity = {
        "x": 0,
        "y": 0
    };
};

/**
 * decelerate scrolling until speed is 0
 */
TouchScroll.prototype.easeOut = function () {
    this.clearEasing();

    this.slide.onscrollend = function () {
        this.clearEasing();
    }.bind(this);

    if (this.velocity.x > 10 || this.velocity.x < -10 || this.velocity.y > 10 || this.velocity.y < -10) {

        this.easeInterval = setInterval(this.stepEasing.bind(this), 1000 / this.fps);
    }

};

TouchScroll.prototype.stepEasing = function () {

    var delta, elapsed;

    elapsed = Date.now() - this.endTime;

    delta = {
        "x": Math.round(this.amplitude.x * Math.exp(-elapsed / this.timeConstant)),
        "y": Math.round(this.amplitude.y * Math.exp(-elapsed / this.timeConstant))
    };

    if (Math.abs(delta.x) == 0 && Math.abs(delta.y) == 0) {
        this.clearEasing();
    } else {
        delta.x *= this.slide.scrollDirection.x == "right" ? 1 : -1;
        delta.y *= this.slide.scrollDirection.y == "down" ? 1 : -1;
        this.slide.translate(delta);
    }

};

/**
 * clear easing interval
 */
TouchScroll.prototype.clearEasing = function () {

    if ("undefined" !== this.easeInterval) {
        clearInterval(this.easeInterval);
        this.easeInterval = undefined;
    }
    return this;
};

TouchScroll.prototype.calculateVelocity = function () {

    var now = Date.now(),
        elapsed = now - this.timestamp,
        vx, vy,
        delta = {
            "x": Math.abs(this.lastState.x - this.slide.current.x),
            "y": Math.abs(this.lastState.y - this.slide.current.y)
        };

    this.timestamp = now;
    this.lastState = this.slide.current;

    vx = (1000 / this.fps) * delta.x / (1 + elapsed);
    vy = (1000 / this.fps) * delta.y / (1 + elapsed);

    this.velocity.x = .8 * vx + .2 * this.velocity.x;
    this.velocity.y = .8 * vy + .2 * this.velocity.y;

    return this;
};

TouchScroll.prototype.calculateAmplitude = function () {

    this.amplitude = {
        "x": this.velocity.x * this.friction,
        "y": this.velocity.y * this.friction
    };

    return this;
};
