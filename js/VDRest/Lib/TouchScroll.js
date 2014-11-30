/**
 * @class
 * @param {TouchSlide.Options} options
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

/**
 * apply
 */
TouchScroll.prototype.apply = function () {

    this.handlerDown = this.onDown.bind(this);
    this.handlerMove = this.onMove.bind(this);
    this.handlerUp = this.onEnd.bind(this);
    this.slide.elem.addEventListener(this.startEvent, this.handlerDown);
};

/**
 * handle start
 * @param {TouchEvent|MouseEvent} e
 */
TouchScroll.prototype.onDown = function (e) {

    this.clearEaseing();
    this.start(e);
    this.slide.elem.addEventListener(this.moveEvent, this.handlerMove);
    document.addEventListener(this.stopEvent, this.handlerUp);
};

/**
 * handle move
 * @param {TouchEvent|MouseEvent} e
 */
TouchScroll.prototype.onMove = function (e) {

    this.saveState();
    this.move(e);
};

/**
 * handle end
 * @param {TouchEvent|MouseEvent} e
 */
TouchScroll.prototype.onEnd = function (e) {

    this.end(e);
    this.slide.elem.removeEventListener(this.moveEvent, this.handlerMove);
    document.removeEventListener(this.stopEvent, this.handlerUp);
    if (this.canEaseOut()) {
        this.easeOut();
    }
};

/**
 * determine if easing is allowed
 * @returns {boolean}
 */
TouchScroll.prototype.canEaseOut = function () {

    var lastState = this.states[this.states.length - 2],
        currentState = this.states[this.states.length - 1],
        canByPos = false, canByTime = false;

    if (
        Math.abs(lastState.slidePos.x - currentState.slidePos.x) +
        Math.abs(lastState.slidePos.y - currentState.slidePos.y) > 10
    ) {
        canByPos = true;
    }

    if (currentState.time - lastState.time < 50) {
        canByTime = true;
    }

    return canByPos && canByTime;
};

/**
 * decelerate scrolling until speed is 0
 */
TouchScroll.prototype.easeOut = function () {

    var fps = 60, delta;
    this.clearEaseing();

    this.easeInterval = setInterval(function () {

        this.slideSpeed.x *= .95;
        this.slideSpeed.y *= .95;

        delta = {
            "x" : Math.round(this.slideSpeed.x * ((1000 / fps) / 1000)),
            "y" : Math.round(this.slideSpeed.y * ((1000 / fps) / 1000))
        };

        if (Math.abs(delta.x) == 0 && Math.abs(delta.y) == 0) {
            this.clearEaseing();
        } else {
            this.slide.getTranslate(true);
            delta.x *= this.slide.scrollDirection.x == "right" ? 1 : -1;
            delta.y *= this.slide.scrollDirection.y == "down" ? 1 : -1;

            this.slide.translate(delta);
        }

    }.bind(this), 1000/fps);

};

/**
 * clear easing interval
 */
TouchScroll.prototype.clearEaseing = function () {

    if ("undefined" !== this.easeInterval) {
        clearInterval(this.easeInterval);
        this.easeInterval = undefined;
    }
};
