TouchMove.Helper = {

    "getTransformVendorPrefix": function (elem) {

        var ret = {};

        if ("undefined" !== typeof elem.style.webkitTransform) {
            ret.prefix = '-webkit-';
            ret.jsStyle = 'webkitTransform';
        } else if ("undefined" !== typeof elem.style.mozTransform) {
            ret.prefix = '-moz-';
            ret.jsStyle = 'mozTransform';
        } else if ("undefined" !== typeof elem.style.msTransform) {
            ret.prefix = '-ms-';
            ret.jsStyle = 'msTransform';
        } else if ("undefined" !== typeof elem.style.oTransform) {
            ret.prefix = '-o-';
            ret.jsStyle = 'oTransform';
        } else {
            ret.prefix = '';
            ret.jsStyle = 'transform';
        }

        return ret;
    }

};
