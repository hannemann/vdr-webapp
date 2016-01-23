/**
 * @typedef {{}} touchMoveScrollBarOptions
 * @property {HTMLElement} parent
 * @property {HTMLElement} scrollElement
 * @property {string} [className]
 * @property {string} [float]
 * @property {string} [direction]
 * @property {boolean} [isTouchMove]
 */

/**
 * @param {touchMoveScrollBarOptions} options
 * @constructor
 * @property {HTMLElement} parent
 * @property {HTMLElement} scrollElement
 * @property {HTMLElement} wrapper
 * @property {HTMLElement} scrollBar
 * @property {Array.<string>} classNames
 * @property {boolean} horizontal
 * @property {boolean} isTouchMove
 */
TouchMove.ScrollBar = function (options) {

    if (!options.parent || !(options.parent instanceof HTMLElement)) {
        throw new TypeError('Specify parent Element for TouchMove.ScrollBar');
    }

    if (!options.scrollElement || !(options.scrollElement instanceof HTMLElement)) {
        throw new TypeError('Specify scrollable Element for TouchMove.ScrollBar');
    }

    this.parent = options.parent;

    this.scrollElement = options.scrollElement;

    this.classNames = [
        'touchmove-scrollbar',
        'hidden'
    ];

    this.isTouchMove = !!options.isTouchMove;

    this.horizontal = false;
    if (options.direction && 'x' === options.direction) {
        this.classNames.push('horizontal');
        this.horizontal = true;
    }

    if (options.className) {
        this.classNames.push(options.className);
    }

    this.float = options.float || 'left';

    this.initialize();
};

/**
 * initialize
 */
TouchMove.ScrollBar.prototype.initialize = function () {

    this.prepareParent()
        .prepareWrapper()
        .prepareScrollBar()
        .compose()
        .render();
};

/**
 * prepare perent node
 * @return {TouchMove.ScrollBar}
 */
TouchMove.ScrollBar.prototype.prepareParent = function () {

    var style = getComputedStyle(this.parent),
        position = style.getPropertyValue('position'),
        zIndex = style.getPropertyValue('z-index');

    if ('static' === position) {
        this.parent.style.position = 'relative';
    }

    if ('auto' === zIndex) {
        this.parent.style.zIndex = 0;
    }

    return this;
};

/**
 * prepare wrapper
 * @return {TouchMove.ScrollBar}
 */
TouchMove.ScrollBar.prototype.prepareWrapper = function () {

    var zIndex = 0;

    this.wrapper = document.createElement('div');
    this.classNames.forEach(function (className) {
        this.wrapper.classList.add(className);
    }.bind(this));

    Array.prototype.slice.apply(this.parent.childNodes).forEach(function (node) {

        var style, nodeZIndex;

        if ( !(node instanceof HTMLElement) ) return;

        style = getComputedStyle(node);
        nodeZIndex = style.getPropertyValue('z-index');

        if ("auto" === nodeZIndex) {
            node.style.zIndex = 0;
        } else if (nodeZIndex >= zIndex) {
            zIndex = nodeZIndex + 1;
        }
    });
    this.wrapper.style.zIndex = zIndex;

    return this;
};

/**
 * prepare scroll bar
 * @return {TouchMove.ScrollBar}
 */
TouchMove.ScrollBar.prototype.prepareScrollBar = function () {

    this.scrollBar = document.createElement('div');
    return this;
};

/**
 * compose nodes
 * @return {TouchMove.ScrollBar}
 */
TouchMove.ScrollBar.prototype.compose = function () {

    this.wrapper.appendChild(this.scrollBar);
    return this;
};

/**
 * render nodes
 * @return {TouchMove.ScrollBar}
 */
TouchMove.ScrollBar.prototype.render = function () {

    this.parent.appendChild(this.wrapper);
    return this;
};

/**
 * add event listeners
 * @return {TouchMove.ScrollBar}
 */
TouchMove.ScrollBar.prototype.onscroll = function (e) {

    if ("undefined" !== typeof this.hideTimeout) {
        clearTimeout(this.hideTimeout);
    }

    if (!this.canScroll()) {
        return this;
    }

    this.wrapper.classList.remove('hidden');

    this.setPosition(e);

    this.hideTimeout = setTimeout(function () {
        this.wrapper.classList.add('hidden');
    }.bind(this), 1000);

    return this;
};

/**
 * set scrollbar position
 * @return {TouchMove.ScrollBar}
 */
TouchMove.ScrollBar.prototype.setPosition = function (e) {

    var factor, parentDim;

    if (this.horizontal) {
        parentDim = this.parent.clientWidth;
        factor = this.scrollElement.offsetWidth / parentDim;
        this.scrollBar.style.left = parseInt(Math.abs(e.x) / factor, 10) + 'px';
        this.scrollBar.style.right = parentDim - parseInt((Math.abs(e.x) + parentDim) / factor, 10) + 'px';
    } else {
        parentDim = this.parent.clientHeight;
        factor = this.scrollElement.offsetHeight / parentDim;
        this.scrollBar.style.top = parseInt(Math.abs(e.y) / factor, 10) + 'px';
        this.scrollBar.style.bottom = parentDim - Math.round((Math.abs(e.y) + parentDim) / factor) + 'px';
    }

    return this;
};

/**
 * determine if scroll bar is applicable
 * @return {boolean}
 */
TouchMove.ScrollBar.prototype.canScroll = function () {

    if (this.disabled) {
        return false;
    }

    if (this.horizontal) {

        return this.parent.clientWidth < this.scrollElement.offsetWidth;

    } else {

        return this.parent.clientHeight < this.scrollElement.offsetHeight;
    }
};

/**
 * disable
 */
TouchMove.ScrollBar.prototype.disable = function () {

    this.disabled = true;
};

/**
 * enable
 */
TouchMove.ScrollBar.prototype.enable = function () {

    this.disabled = false;
};
