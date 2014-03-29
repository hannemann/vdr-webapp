/**
 * @param options
 * @constructor
 */
GuiItem = function (options) {
    var i;
    this.data = {};

    for (i in options) {
        if (options.hasOwnProperty(i)) {
            this.data[i] = options[i];
        }
    }
};

/**
 * retrieve HTMLElement
 * @return {*}
 */
GuiItem.prototype.dom = function () {
    return this.element;
};

/**
 * retrieve option
 * @param option
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
};

/**
 *
 * @param option
 * @param value
 * @return {*}
 */
GuiItem.prototype.set = function (option, value) {
    this.data[option] = value;
    return this;
};
