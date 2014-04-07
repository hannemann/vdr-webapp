/**
 * @constructor
 * @member {object} data
 */
VDRest.Lib.Object = function () {};

/**
 * initialize store
 * @param {Object} data
 */
VDRest.Lib.Object.prototype.initData = function (data) {

    data = data || {};

    this.data = data;

    return this;
};

/**
 * retrieve option
 * @param [option] {String}
 * @param [defaultValue] {*}
 * @return {*}
 */
VDRest.Lib.Object.prototype.getData = function (option, defaultValue) {

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
 * @param {String} option
 * @param {*} value
 * @return {VDRest.Lib.Object}
 */
VDRest.Lib.Object.prototype.setData = function (option, value) {

    this.data[option] = value;
    return this;
};

/**
 * determine if object has option in its store
 * @param {string} option
 * @returns {boolean}
 */
VDRest.Lib.Object.prototype.hasData = function (option) {

    return "undefined" !== this.data[option];
};

/**
 * retrieve helper object
 * @returns {VDRest.helper|*}
 */
VDRest.Lib.Object.prototype.helper = function () {

    return VDRest.helper;
};