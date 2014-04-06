/**
 * @param options
 * @constructor
 */
VDRest.Gui.Item = function () {

    this.element = null;
};

VDRest.Gui.Item.prototype = new VDRest.Lib.Object();

/**
 * retrieve HTMLElement
 * @return {*}
 */
VDRest.Gui.Item.prototype.dom = function () {

    return this.element;
};
