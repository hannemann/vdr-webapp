/**
 * inject element that animates list elements
 * android lollipop like on touch
 * @constructor
 */
var ActiveAnimate = function () {
    this.finishHandler = this.finishAnimation.bind(this);
    this.animationHandler = this.animate.bind(this);
    this.cancelHandler = this.cancelAnimation.bind(this);
    this.getGradientElement();
};

/**
 * apply animation to element
 * @param {jQuery.Event|Event} e
 */
ActiveAnimate.prototype.applyAnimation = function (e) {

    e.preventDefault();

    this.getTouch(e);

    if (this.event.target !== this.gradientElement && !this.gradientElement.parentNode) {

        this.event.target.addEventListener('touchmove', this.cancelHandler);
        this.animationTimeout = setTimeout(function () {

            this.event.target.addEventListener('touchmove', this.finishHandler);
            this.init()
                .getStartPosition()
                .resetGradient()
                .injectElement()
                .startAnimation();

        }.bind(this), 300);
    }
};

/**
 * cancel animation before timeout exceeded
 */
ActiveAnimate.prototype.cancelAnimation = function () {

    clearTimeout(this.animationTimeout);
};

/**
 * initialize animation
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.init = function () {

    this.step = 1;
    this.increment = 16;
    this.max = this.event.target.getBoundingClientRect().width;
    this.onReadyRemove = false;
    this.event.target.addEventListener('touchend', this.finishHandler);

    return this;
};

/**
 * retrieve relative touch position
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.getStartPosition = function () {

    var o = this.event.target.getBoundingClientRect();

    this.startPosition = {
        "x" : this.event.pageX - o.left,
        "y" : this.event.pageY - o.top
    };

    return this;
};

/**
 * reset gradient style
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.resetGradient = function () {

    this.gradientElement.style.backgroundImage = 'radial-gradient(' +
    '15px at ' + this.startPosition.x.toString() + 'px ' + this.startPosition.y.toString() + 'px, ' +
    'rgba(255,255,255,0.4) 15px, ' +
    'rgba(255,255,255,0.4) 16px, ' +
    'rgba(255,255,255,0.2) 17px' +
    ')';

    return this;
};

/**
 * inject gradient element
 * @returns {ActiveAnimate}
 */
ActiveAnimate.prototype.injectElement = function () {

    this.event.target.insertBefore(this.gradientElement, this.event.target.firstChild);
    return this;
};

/**
 * start animation
 */
ActiveAnimate.prototype.startAnimation = function () {

    requestAnimationFrame(this.animationHandler);
};

/**
 * animation function
 */
ActiveAnimate.prototype.animate = function () {

    this.increment += this.step;

    if (this.increment > this.max) {

        if (this.onReadyRemove) {
            this.removeGradientElement();
        }
    } else {

        this.gradientElement.style.backgroundImage = 'radial-gradient(' +
        '15px at ' + this.startPosition.x.toString() + 'px ' + this.startPosition.y.toString() + 'px, ' +
        'rgba(255,255,255,0.4) 15px, ' +
        'rgba(255,255,255,0.4) ' + this.increment.toString() + 'px, ' +
        'rgba(255,255,255,0.2) ' + (this.increment + 1).toString() + 'px' +
        ')';
        requestAnimationFrame(this.animationHandler);
    }
};

/**
 * finish animation
 */
ActiveAnimate.prototype.finishAnimation = function () {

    this.detach();
    if (this.increment < this.max) {
        this.step = 5;
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

    this.event.target.removeEventListener('touchend', this.finishHandler);
    this.event.target.removeEventListener('touchmove', this.cancelHandler);
    this.event.target.removeEventListener('touchmove', this.finishHandler);
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

var activeAnimate = new ActiveAnimate();
