/**
 * @class
 * @constructor
 */
VDRest.Info.Model.Info = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Info.Model.Info.prototype = new VDRest.Abstract.Model();

/**
 * initialize info
 */
VDRest.Info.Model.Info.prototype.init = function () {

      this.load();
};

/**
 * get resource, load info
 */
VDRest.Info.Model.Info.prototype.load = function () {

    this.getResource().load({
        "url" : "info",
        "method" : "GET",
        "callback" : $.proxy(function (e) {

            var i;

            for (i in e) {

                if (e.hasOwnProperty(i)) {

                    this.setData(i, e[i]);
                }
            }

            $.event.trigger('infoupdate');

        }, this)
    });
};

/**
 * retrieve info resource model
 * @returns {VDRest.Info.Model.Info.Resource}
 */
VDRest.Info.Model.Info.prototype.getResource = function () {

    return this.module.getResource('Info');
};
