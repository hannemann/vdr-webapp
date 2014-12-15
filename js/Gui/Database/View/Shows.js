/**
 * @class
 * @constructor
 */
Gui.Database.View.Shows = function () {
};

/**
 * @type {Gui.Database.View.List}
 */
Gui.Database.View.Shows.prototype = new Gui.Database.View.List();

/**
 * add title
 * @param {HTMLElement} tile
 * @returns {Gui.Database.View.Shows}
 */
Gui.Database.View.Shows.prototype.addTitle = function (tile) {

    this.currentTitle = tile.querySelector('div.name').cloneNode(true);
    this.window.insertBefore(this.currentTitle, this.window.firstChild);

    return this;
};
