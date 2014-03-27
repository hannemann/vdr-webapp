/**
 *
 * @param options
 * @constructor
 */
GuiItem = function (options, element) {
    var i= 0;
    this.data = {};

    for (i in options) {
        this.data[i] = options[i];
    }
//
//    if ('undefined' !== this.mainClassName) {
//        element.addClass(this.mainClassName);
//    }
};

/**
 * retrieve HTMLElement
 * @return {jQuery}
 */
GuiItem.prototype.dom = function () {
    return this.element;
}

/**
 * retrieve option
 * @param field
 * @param defaultValue
 * @return {*}
 */
GuiItem.prototype.get = function (option, defaultValue) {
    if ('undefined' !== this.data[option]) {
        return this.data[option];
    } else if (defaultValue) {
        return defaultValue;
    }
    return null;
}

/**
 *
 * @param option
 * @param value
 * @return {*}
 */
GuiItem.prototype.set = function (option, value) {
    this.data[option] = value;
    return this;
}