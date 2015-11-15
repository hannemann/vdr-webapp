/**
 * @constructor
 * @property {object} data
 */
VDRest.Lib.Object = function () {};

/**
 * initialize store
 * @param {Object} [data]
 * @returns {VDRest.Lib.Object}
 */
VDRest.Lib.Object.prototype.initData = function (data) {

    var i;

    this.length = 0;

    data = data || {};

    this.data = data;

    for (i in this.data) {

        if (this.data.hasOwnProperty(i)) {
            this.length++;
        }
    }

    this.each = function (callback) {

        if ("function" !== typeof callback) return;

        for (i in this.data) {

            if (this.data.hasOwnProperty(i)) {

                callback(i, this.data[i]);
            }
        }
    };

    return this;
};

/**
 * get initialized instance
 * @param {{}} [data]
 * @returns {VDRest.Lib.Object}
 */
VDRest.Lib.Object.prototype.getInstance = function (data) {

    var obj = new VDRest.Lib.Object();

    return obj.initData(data);
};

/**
 * retrieve option
 * @param {String} [option]
 * @param {*} [defaultValue]
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
    this.length++;
    return this;
};

/**
 *
 * @param {String} option
 * @return {VDRest.Lib.Object}
 */
VDRest.Lib.Object.prototype.unsData = function (option) {

    delete this.data[option];
    return this;
};

/**
 * determine if object has option in its store
 * @param {string} option
 * @returns {boolean}
 */
VDRest.Lib.Object.prototype.hasData = function (option) {

    return "undefined" !== typeof this.data[option];
};

/**
 * retrieve helper object
 * @returns {VDRest.helper|*}
 */
VDRest.Lib.Object.prototype.helper = function () {

    return VDRest.helper;
};