/**
 * @class
 * @constructor
 */
Gui.Database.View.List = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.List.prototype = new VDRest.Abstract.View();

/**
 * bypass caching mechanism
 */
Gui.Database.View.List.prototype.bypassCache = true;

/**
 * initialize node
 */
Gui.Database.View.List.prototype.init = function () {

    this.node = $('<div class="database-collection ' + this.id.toLowerCase() + ' database-collection-slider">');
};

/**
 * render
 */
Gui.Database.View.List.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    this.setWidth(0);
    this.window = document.querySelector('#viewport .database-list');
};

/**
 * set width
 * @param width
 */
Gui.Database.View.List.prototype.setWidth = function (width) {

    this.node[0].style.width = width + 'px';
};

/**
 * apply highlight styles to specific element in scroller
 * @param {HTMLElement} tile
 * @param {Number} zPos
 * @param {Number} zIndex
 * @param {String} className
 * @returns {Gui.Database.View.List}
 */
Gui.Database.View.List.prototype.applyHighlight = function (tile, zPos, zIndex, className) {

    this.applyHighlightStyles(tile, 'translateZ(' + zPos + 'px)', zIndex);
    tile.classList.add(className);

    return this;
};

/**
 * remove highlight styles from specific element in scroller
 * @param {HTMLElement} tile
 * @returns {Gui.Database.View.List}
 */
Gui.Database.View.List.prototype.removeHighlight = function (tile) {

    this.applyHighlightStyles(tile, '', 0);
    tile.classList.remove('previous', 'active');

    return this;
};

Gui.Database.View.List.prototype.applyHighlightStyles = function (tile, transform, zIndex) {

    var img = tile.querySelector('img.poster');

    if (img) img.style.transform = transform;
    tile.style.zIndex = zIndex;

    return this;
};

/**
 * toggle title
 * @param {HTMLElement} tile
 * @returns {Gui.Database.View.List}
 */
Gui.Database.View.List.prototype.toggleTitle = function (tile) {

    if (this.currentTitle) {
        this.currentTitle.style.position = 'absolute';
        this.currentTitle.style.top = 0;
        this.currentTitle.classList.add('transparent');
        this.oldTitle = this.currentTitle;
    }

    return this.addTitle(tile);
};

/**
 * add title
 * @param {HTMLElement} tile
 * @returns {Gui.Database.View.List}
 */
Gui.Database.View.List.prototype.addTitle = function (tile) {

    this.currentTitle = tile.querySelector('div.title').cloneNode(true);
    this.window.insertBefore(this.currentTitle, this.window.firstChild);

    return this;
};

/**
 * toggle fanart
 * @param {HTMLElement} tile
 * @returns {Gui.Database.View.List}
 */
Gui.Database.View.List.prototype.toggleFanart = function (tile) {

    if (this.currentFanart) {
        this.currentFanart.classList.add('transparent');
        this.oldFanart = this.currentFanart;
    }

    return this.addFanart(tile);
};

/**
 * add fanart
 * @param {HTMLElement} tile
 * @returns {Gui.Database.View.List}
 */
Gui.Database.View.List.prototype.addFanart = function (tile) {

    this.currentFanart = tile.querySelector('img.fanart');
    if (this.currentFanart) {
        this.currentFanart = this.currentFanart.cloneNode(false);
        this.window.insertBefore(this.currentFanart, this.window.firstChild);
    }

    return this;
};
