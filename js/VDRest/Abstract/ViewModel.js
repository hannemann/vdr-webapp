
/**
 * @class Abstract view model
 * @constructor
 *
 * @var {object} data
 * @property {VDRest.Abstract.View} view
 * @var {object} resource
 */
VDRest.Abstract.ViewModel = function () {};

/**
 * prototype
 * @type {VDRest.Lib.Object}
 */
VDRest.Abstract.ViewModel.prototype = new VDRest.Lib.Object();

/**
 * add magic methods to view
 *
 * @param {object} [resource] alternate resource
 * @param {string} [prefix]  prefix for methods
 */
VDRest.Abstract.ViewModel.prototype.initViewMethods = function (resource, prefix) {

    var i, fragment, name;

    resource = resource || this.resource;

    for (i in resource) {

        if (resource.hasOwnProperty(i)) {

            if (prefix) {

                name = prefix + '_' + i;

            } else {

                name = i;
            }

            fragment = this.getMethodFragment(name);

            this.data.view['get' + fragment] = function (x) {

                return function () {

                    return resource[x];
                }
            }(i);

            this.data.view['set' + fragment] = function (x) {

                return function (value) {

                    resource[x] = value;

                    return this;
                }
            }(i);

            this.data.view['has' + fragment] = function (x) {

                return function () {

                    return !! resource[x];
                }
            }(i);
        }
    }
};

VDRest.Abstract.ViewModel.prototype.getMethodFragment = function (property) {

    var parts = property.split('_'), i = 0, l = parts.length;

    for (i;i<l;i++) {
        parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1);
    }

    return parts.join('');
};