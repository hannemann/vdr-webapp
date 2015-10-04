/**
 * inject element that animates list elements
 * android lollipop like on touch
 * @constructor
 */
var ActiveAnimate = function () {
    this.finishHandler = this.finishAnimation.bind(this);
    this.cancelHandler = this.cancelAnimation.bind(this);
    this.removeHandler = this.removeGradientElement.bind(this);
    this.preventDefaultHandler = this.preventDefault.bind(this);
    this.attachDefaultsHandler = this.attachDefaults.bind(this);
    this.clickAnimationHandler = this.animateClickGradient.bind(this);
    this.pressAnimationHandler = this.animatePressGradient.bind(this);
    this.getGradientElement();
};

/**
 * apply animation to element
 * @param {jQuery.Event|Event} e
 * @param {HTMLElement} [node]
 */
ActiveAnimate.prototype.applyAnimation = function (e, node) {

    this.preventDefaults();

    this.getTouch(e);

    this.target = node || this.event.target;

    this.addListener('end', 'attachDefaults');
    this.addListener('end', 'remove');

    this.getStartPosition().removeGradientElement();

    if (this.target !== this.gradientElement) {

        this.addListener('move', 'cancel');
        this.addListener('end', 'cancel');
        this.animationTimeout = setTimeout(function () {

            this.addListener('move', 'finish');
            this.init()
                .injectElement()
                .initClickGradient()
                .animateClickGradient();

        }.bind(this), 50);
    }
};

/**
 * cancel animation before timeout exceeded
 * @param {Event} e
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
    this.addListener('end', 'finish');
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

    if (this.fgOpacity >= 0.2 || this.fgOpacity < 0) {

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
    this.step = 2;
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
 * @param {function} handler
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
 * increase step to fasten animation till end is reached
 * useful to indicate that timeout for long tap is reached
 */
ActiveAnimate.prototype.endAnimation = function () {

    this.step = 10;
};

/**
 * finish animation
 * @param {Event} e
 */
ActiveAnimate.prototype.finishAnimation = function (e) {

    var force = false, delta;

    this.detach();

    if ("undefined" !== typeof TouchEvent && e instanceof TouchEvent && 'touchmove' === e.type) {

        if (this.moveCancel(e)) {
            force = true;
        } else {
            return;
        }
    }

    if (force || this.increment < this.max) {
        if ('press' === this.currentAnimation) {
            this.step = 5;
            delta = this.max - this.increment;
            this.opacityDecrement = this.fgOpacity / (delta/this.step);
            this.animateOpacity = true;
        } else {
            this.step = -0.04;
        }
        this.onReadyRemove = true;
    } else {
        this.removeGradientElement();
    }
};

/**
 * remove injected element
 * @param {Event} [e]
 */
ActiveAnimate.prototype.removeGradientElement = function (e) {

    if ("undefined" !== typeof e) {
        this.removeListener('end', 'remove');
    }

    if (this.gradientElement.parentNode) {
        this.gradientElement.parentNode.removeChild(this.gradientElement);
    }
    return this;
};

/**
 * detach touch end event
 */
ActiveAnimate.prototype.detach = function () {

    this.removeListener('end', 'finish');
    this.removeListener('move', 'finish');
    this.removeListener('end', 'cancel');
    this.removeListener('move', 'cancel');
    return this;
};

/**
 * get Touch Object
 * @param {Event|jQuery.Event} e
 */
ActiveAnimate.prototype.getTouch = function (e) {

    var event;

    if (e instanceof jQuery.Event) {
        event = e.originalEvent;
    } else {
        event = e;
    }

    if ("undefined" !== typeof TouchEvent && event instanceof TouchEvent) {
        event = event.changedTouches[0];
    }

    this.event = event;

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
 * @param {Event} e
 * @returns {boolean}
 */
ActiveAnimate.prototype.moveCancel = function (e) {

    var event;

    if ("undefined" !== typeof TouchEvent && e instanceof TouchEvent) {
        event = e.changedTouches[0]
    } else {
        event = e;
    }

    return Math.abs(event.pageX - this.startPosition.x) > 5 ||
        Math.abs(event.pageY - this.startPosition.y) > 5;
};

/**
 * add listener to target
 * @param {string} type
 * @param {string} handler
 */
ActiveAnimate.prototype.addListener = function (type, handler) {

    this.target.addEventListener(this.getPointer(type), this.getHandler(handler));
};

/**
 * remove listener from target
 * @param {string} type
 * @param {string} handler
 */
ActiveAnimate.prototype.removeListener = function (type, handler) {

    this.target.removeEventListener(this.getPointer(type), this.getHandler(handler));
};

/**
 * retrieve pointer type
 * @param {string} type
 * @returns {string}
 */
ActiveAnimate.prototype.getPointer = function (type) {

    var pointer = 'touch';

    if (this.event instanceof MouseEvent) {
        if ('start' === type) {
            type = 'down';
        } else if ('end' === type) {
            type = 'up';
        }
        pointer = 'mouse'
    }

    return pointer + type;
};

/**
 * retrieve event handler
 * @param {string} type
 * @returns {function}
 */
ActiveAnimate.prototype.getHandler = function (type) {

    var handler;

    if ('cancel' === type) {
        handler = this.cancelHandler;
    } else if ('finish' === type) {
        handler = this.finishHandler;
    } else if ('attachDefaults' === type) {
        handler = this.attachDefaultsHandler;
    } else if ('remove' === type) {
        handler = this.removeHandler;
    }

    return handler;
};

/**
 * prevent selection and context menu
 */
ActiveAnimate.prototype.preventDefaults = function () {

    document.addEventListener('selectstart', this.preventDefaultHandler);
    document.addEventListener('contextmenu', this.preventDefaultHandler);
};

/**
 * reattach selection and context menu
 */
ActiveAnimate.prototype.attachDefaults = function () {

    document.removeEventListener('selectstart', this.preventDefaultHandler);
    document.removeEventListener('contextmenu', this.preventDefaultHandler);
    this.removeListener('end', 'attachDefaults');
};

/**
 * prevent default
 * @param {Event} e
 */
ActiveAnimate.prototype.preventDefault = function (e) {
    e.preventDefault();
};

var activeAnimate = new ActiveAnimate(),
    handlePointerActive = activeAnimate.applyAnimation.bind(activeAnimate);
