/**
 * inject element that animates list elements
 * android lollipop like on touch
 * @constructor
 */
var ActiveAnimate = function () {
    this.finishHandler = this.finishAnimation.bind(this);
    this.clickAnimationHandler = this.animateClickGradient.bind(this);
    this.pressAnimationHandler = this.animatePressGradient.bind(this);
    this.cancelHandler = this.cancelAnimation.bind(this);
    this.getGradientElement();
};

/**
 * apply animation to element
 * @param {jQuery.Event|Event} e
 * @param {HTMLElement} [node]
 */
ActiveAnimate.prototype.applyAnimation = function (e, node) {

    this.getTouch(e);

    this.target = node || this.event.target;

    this.getStartPosition();

    if (this.target !== this.gradientElement && !this.gradientElement.parentNode) {

        this.target.addEventListener('touchmove', this.cancelHandler);
        this.target.addEventListener('touchend', this.cancelHandler);
        this.animationTimeout = setTimeout(function () {

            this.target.addEventListener('touchmove', this.finishHandler);
            this.init()
                .injectElement()
                .initClickGradient()
                .animateClickGradient();

        }.bind(this), 50);
    }
};

/**
 * cancel animation before timeout exceeded
 */
ActiveAnimate.prototype.cancelAnimation = function (e) {

    if ('touchend' === e.type || this.moveCancel(e)) {
        clearTimeout(this.animationTimeout);
    }
};

/**
 * initialize animation
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.init = function () {

    this.step = 0.04;
    this.max = this.target.getBoundingClientRect().width;
    this.increment = this.max;
    this.fgOpacity = 0;
    this.bgOpacity = 0;
    this.onReadyRemove = false;
    this.animateOpacity = false;
    this.target.addEventListener('touchend', this.finishHandler);
    this.currentAnimation = 'click';

    return this;
};

/**
 * retrieve relative touch position
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.getStartPosition = function () {

    var o = this.target.getBoundingClientRect();

    this.startPosition = {
        "x" : this.event.pageX - o.left,
        "y" : this.event.pageY - o.top
    };

    return this;
};

/**
 * initialize click gradient
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.initClickGradient = function () {

    this.gradientElement.style.backgroundImage = this.getGradient();

    return this;
};

/**
 * animate click gradient
 */
ActiveAnimate.prototype.animateClickGradient = function () {

    this.fgOpacity += this.step;

    if (this.fgOpacity >= 0.2) {

        if (this.onReadyRemove) {
            this.removeGradientElement();
        } else {
            this.initPressGradient()
                .animatePressGradient();
        }
    } else {

        this.animate(this.clickAnimationHandler);
    }
};

/**
 * init press gradient animation
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.initPressGradient = function () {

    this.increment = 16;
    this.step = 1;
    this.currentAnimation = 'press';
    this.fgOpacity = 0.4;
    this.bgOpacity = 0.2;

    this.gradientElement.style.backgroundImage = this.getGradient();

    return this;
};

/**
 * inject gradient element
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.injectElement = function () {

    this.target.insertBefore(this.gradientElement, this.target.firstChild);
    return this;
};

/**
 * animation function
 */
ActiveAnimate.prototype.animatePressGradient = function () {

    this.increment += this.step;

    if (this.increment > this.max) {

        if (this.onReadyRemove) {
            this.removeGradientElement();
        }
    } else {

        this.animate(this.pressAnimationHandler);
    }
};

/**
 * apply animation to gradient element
 * @param handler
 */
ActiveAnimate.prototype.animate = function (handler) {

    if (this.animateOpacity) {
        this.fgOpacity -= this.opacityDecrement;
    }

    this.gradientElement.style.backgroundImage = this.getGradient();
    requestAnimationFrame(handler);
};

/**
 * retrieve gradient css string
 * @returns {string}
 */
ActiveAnimate.prototype.getGradient = function () {

    return 'radial-gradient(' +
        '15px at ' + this.startPosition.x.toString() + 'px ' + this.startPosition.y.toString() + 'px, ' +
        'rgba(255,255,255,' + this.fgOpacity.toString() + ') 15px, ' +
        'rgba(255,255,255,' + this.fgOpacity.toString() + ') ' + this.increment.toString() + 'px, ' +
        'rgba(255,255,255,' + this.bgOpacity.toString() + ') ' + (this.increment + 1).toString() + 'px' +
        ')';
};

/**
 * finish animation
 */
ActiveAnimate.prototype.finishAnimation = function (e) {

    var force = false, delta;

    this.detach();

    if (e instanceof TouchEvent && 'touchmove' === e.type) {

        if (this.moveCancel(e)) {
            force = true;
        } else {
            return;
        }
    }

    if (force || this.increment < this.max) {
        if ('press' === this.currentAnimation) {
            this.step = 5;
        }
        this.animateOpacity = true;
        delta = this.max - this.increment;
        this.opacityDecrement = this.fgOpacity / (delta/this.step);
        this.onReadyRemove = true;
    } else {
        this.removeGradientElement();
    }
};

/**
 * remove injected element
 */
ActiveAnimate.prototype.removeGradientElement = function () {

    this.gradientElement.parentNode.removeChild(this.gradientElement);
    return this;
};

/**
 * detach touch end event
 */
ActiveAnimate.prototype.detach = function () {

    this.target.removeEventListener('touchend', this.finishHandler);
    this.target.removeEventListener('touchmove', this.finishHandler);
    this.target.removeEventListener('touchend', this.cancelHandler);
    this.target.removeEventListener('touchmove', this.cancelHandler);
    return this;
};

/**
 * get Touch Object
 * @param {Event|jQuery.Event} e
 */
ActiveAnimate.prototype.getTouch = function (e) {

    if (e instanceof jQuery.Event) {
        this.event = e.originalEvent.changedTouches[0];
    } else {
        this.event = e.changedTouches[0];
    }

    return this;
};

/**
 * retrieve gradient element
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.getGradientElement = function () {

    if (!this.gradientElement) {
        this.gradientElement = document.createElement('DIV');
        this.gradientElement.style.position = "absolute";
        this.gradientElement.style.top = 0;
        this.gradientElement.style.right = 0;
        this.gradientElement.style.bottom = 0;
        this.gradientElement.style.left = 0;
        this.gradientElement.style.zIndex = 0;
        this.gradientElement.style.backfaceVisibility = 'hidden';
        this.gradientElement.style.perspective = '1000px';
    }

    return this;
};

/**
 * determine if movement exceeds threshold
 * @param e
 * @returns {boolean}
 */
ActiveAnimate.prototype.moveCancel = function (e) {

    return Math.abs(e.changedTouches[0].pageX - this.startPosition.x) > 5 ||
        Math.abs(e.changedTouches[0].pageY - this.startPosition.y) > 5;
};

var activeAnimate = new ActiveAnimate();
