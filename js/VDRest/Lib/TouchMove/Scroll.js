/**
 * @class
 * @param {TouchMove.Options} options
 * @constructor
 */
TouchMove.Scroll = function (options) {
    TouchMove.prototype.init.call(this, options);

    this.grid = options.grid || {"x" : 0, "y" : 0, "easing" : undefined, "threshold" : undefined};
};

/**
 * @type {TouchMove}
 */
TouchMove.Scroll.prototype = new TouchMove();

/**
 * @type {number}
 */
TouchMove.Scroll.prototype.timeConstant = 325 / 60;

/**
 * @type {number}
 */
TouchMove.Scroll.prototype.friction = 0.8;

/**
 * handle start
 * @param {TouchEvent|MouseEvent} e
 */
TouchMove.Scroll.prototype.start = function (e) {

    this.reset();
    TouchMove.prototype.start.call(this, e);
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
TouchMove.Scroll.prototype.reset = function () {

    this.stopEasing = true;
    this.velocity = this.amplitude = {
        "x": 0,
        "y": 0
    };
};

/**
 * decelerate scrolling until speed is 0
 */
TouchMove.Scroll.prototype.easeOut = function () {

    this.stopEasing = false;
    this.slider.onscrollend = function () {
        this.reset();
        cancelAnimationFrame(this.currentFrame);
    }.bind(this);

    if (this.velocity.x > 10 || this.velocity.x < -10 || this.velocity.y > 10 || this.velocity.y < -10) {

        this.currentFrame = requestAnimationFrame(this.stepEasing.bind(this));

    } else if (this.grid.x > 0 || this.grid.y > 0) {

        this.snapToGrid();
    }
};

/**
 * calculate delta and call slider translate
 */
TouchMove.Scroll.prototype.stepEasing = function (tick) {

    var elapsed = tick - this.endTime,
        delta = {
            "x": this.amplitude.x * Math.exp(-elapsed / this.timeValue),
            "y": this.amplitude.y * Math.exp(-elapsed / this.timeValue)
        };

    if (this.snaps(delta)) {

        this.snapToGrid(delta);

    } else if (!this.stopEasing && (delta.x > 0.5 || delta.y > 0.5)) {

        delta.x *= this.slider.scrollDirections.x == "right" ? 1 : -1;
        delta.y *= this.slider.scrollDirections.y == "down" ? 1 : -1;

        this.slider.translate(delta);
        this.currentFrame = requestAnimationFrame(this.stepEasing.bind(this));
    }

};

/**
 * determine if slider should snap to grid
 * @param {{x: Number, y: Number}} delta
 * @returns {boolean}
 */
TouchMove.Scroll.prototype.snaps = function (delta) {

    var threshold = this.grid.threshold || 5;

    return !this.stopEasing && (this.grid.x > 0 || this.grid.y > 0) && delta.x <= threshold && delta.y <= threshold;
};

/**
 * snap to grid
 * @param {{x: Number, y: Number}} [delta]
 */
TouchMove.Scroll.prototype.snapToGrid = function (delta) {

    var state = this.slider.getState(),
        snap = {};

    delta = delta || {"x" : 0, "y" : 0};

    if (this.grid.x && this.grid.x > 0) {
        snap.x = Math.round((state.x + delta.x) / this.grid.x) * this.grid.x;
        delta.x = snap.x - state.x;
    }
    if (this.grid.y && this.grid.y > 0) {
        snap.y = Math.round((state.y + delta.y) / this.grid.y) * this.grid.y;
        delta.y = snap.y - state.y;
    }

    if (this.grid.easing) {
        this.slider.setTransition('transform ' + this.grid.easing);
    } else {
        this.slider.setTransition('transform .1s ease-in-out');
    }

    this.slider.translate(delta);
};

/**
 * calculate average velocity
 * @returns {TouchMove.Scroll}
 */
TouchMove.Scroll.prototype.calculateVelocity = function () {

    var states = this.slider.states,
        elapsed = Math.round(states[states.length - 1].tick - states[0].tick),
        fps = Math.round(this.slider.states.length * 1000 / elapsed),
        vx = 0, vy = 0, i = 1, l = states.length,
        lastState = states[0],
        delta = {};

    lastState.elapsed = 0;

    this.timeValue = this.timeConstant * fps;

    for (i;i<l;i++) {
        delta.x = Math.abs(states[i].x - lastState.x);
        delta.y = Math.abs(states[i].y - lastState.y);
        elapsed = lastState.elapsed * .2 + .8 * Math.round(states[i].tick - lastState.tick);
        lastState = states[i];
        lastState.elapsed = elapsed;
        vx = (1000/fps) * delta.x / elapsed;
        vy = (1000/fps) * delta.y / elapsed;
        this.velocity.x = .8 * vx + .2 * this.velocity.x;
        this.velocity.y = .8 * vy + .2 * this.velocity.y;
    }

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
