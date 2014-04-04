VDRest.Lib = VDRest.Lib || function () {};

VDRest.Lib.Factory = function () {

    this.classes = {};
};

VDRest.Lib.Factory.prototype.getClass = function (path, data) {

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

VDRest.Lib.Factory.prototype.getConstructor = function (path) {

    var _class = null, i = 0, l, wrapper = VDRest;

    path = path.split('.');
    l = path.length;

    for (i;i<l;i++) {

        if (! _class && this.classExists(wrapper, path[i])) {

            _class = wrapper[path[i]];
        } else if (this.classExists(_class, path[i])) {

            _class = _class[path[i]];

        } else {

            throw 'Class ' + path[i] + ' does not exist in ' + wrapper + ', Factory'
        }

        wrapper += '.' + path[i];
    }

    return _class;
};

VDRest.Lib.Factory.prototype.classExists = function (wrapper, className) {

    return "function" === typeof wrapper[className];
};

VDRest.Lib.factory = new VDRest.Lib.Factory();