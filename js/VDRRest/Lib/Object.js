VDRest.Lib = VDRest.Lib || function () {};

VDRest.Lib.Object = function () {};

VDRest.Lib.Object.prototype.namespace = 'VDRest';

/**
 * initialize store
 * @param data {Object}
 */
VDRest.Lib.Object.prototype.initData = function (data) {

    data = data || {};

    this.data = data;

    return this;
};

/**
 * retrieve option
 * @param option {String}
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
 * @param option {String}
 * @param value {*}
 * @return {*}
 */
VDRest.Lib.Object.prototype.setData = function (option, value) {

    this.data[option] = value;
    return this;
};

VDRest.Lib.Object.prototype.hasData = function (option) {

    return "undefined" !== this.data[option];
}