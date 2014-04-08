
/**
 * @class Abstract view model
 * @constructor
 */
VDRest.Abstract.ViewModel = function () {};

/**
 * prototype
 * @type {VDRest.Lib.Object}
 */
VDRest.Abstract.ViewModel.prototype = new VDRest.Lib.Object();

VDRest.Abstract.ViewModel.prototype.initViewGetters = function () {

    var i, method, me = this;

    for (i in this.resource) {

        if (this.resource.hasOwnProperty(i)) {

            method = this.getMethodName(i);


            this.data.view[method] = function (x) {

                return function () {
                    return me.resource[x];
                }
            }(i);
        }
    }
};

VDRest.Abstract.ViewModel.prototype.getMethodName = function (property) {

    var parts = property.split('_'), i = 0, l = parts.length;

    for (i;i<l;i++) {
        parts[i] = parts[i].slice(0, 1).toUpperCase() + parts[i].slice(1);
    }

    return 'get' + parts.join('');
};