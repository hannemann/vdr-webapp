var Lib = Lib || function () {};

Lib.Factory = function () {

    this.classes = {};
};

Lib.Factory.prototype.getClass = function (path, data) {

    var _class = null,
        instance;

    data = data || {};

    if ("undefined" === typeof this.classes[path]) {

        _class = this.getConstructor(path);
    } else {
        _class = this.classes[path];
    }

    instance = new _class();

    if ('function' === typeof instance.initData) {

        instance.initData(data);
    }

    return instance;

};

Lib.Factory.prototype.getConstructor = function (path) {

    var _class = null, i = 0, l, wrapper = 'window';

    path = path.split('.');
    l = path.length;

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

    return _class;
};

Lib.Factory.prototype.classExists = function (wrapper, className) {

    return "function" === typeof wrapper[className];
};

Lib.factory = new Lib.Factory();