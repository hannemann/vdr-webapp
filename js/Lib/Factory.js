var Lib = Lib || function () {};

Lib.Factory = function () {};

Lib.Factory.prototype.getClass = function (path, data) {

    var _class = null, i = 0, l, instance, wrapper = 'window';

    path = path.split('.');
    l = path.length;

    data = data || {};

    for (i;i<l;i++) {

        wrapper += '.' + path[i];

        if (! _class && this.classExists(window, path[i])) {

            _class = window[path[i]];
        } else if (this.classExists(_class, path[i])) {

            _class = _class[path[i]];

        } else {

            throw 'Class ' + path[i] + ' does not exist in ' + wrapper + ', Factory'
        }
    }

    instance = new _class();

    if ('function' === typeof instance.initData) {

        instance.initData(data);
    }

    return instance;

};

Lib.Factory.prototype.classExists = function (wrapper, className) {

    return "function" === typeof wrapper[className];
};

Lib.factory = new Lib.Factory();