/**
 * @param options
 * @constructor
 */
Gui.Item = function () {

    this.element = null;
};

Gui.Item.prototype = new Lib.Object();

/**
 * retrieve HTMLElement
 * @return {*}
 */
Gui.Item.prototype.dom = function () {

    return this.element;
};
