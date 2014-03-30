/**
 * @param options
 * @constructor
 */
GuiItem = function (options) {
    var i;
    this.data = {};
    this.element = null;

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
GuiItem.prototype.getData = function (option, defaultValue) {

    if ('undefined' === typeof option) {

        return this.data
    }

    if ('undefined' !== typeof this.data[option]) {

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
GuiItem.prototype.setData = function (option, value) {

    this.data[option] = value;
    return this;
};
