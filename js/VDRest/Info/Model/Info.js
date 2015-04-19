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
 * @type {VDRest.Abstract.Model}
 */
VDRest.Info.Model.Info.prototype.minRemuxRecordingsVersnum = 601;

/**
 * initialize info
 */
VDRest.Info.Model.Info.prototype.init = function () {

      this.load();
};

/**
 * @returns {boolean}
 */
VDRest.Info.Model.Info.prototype.canUseHtmlPlayer = function () {

    return this.getStreamer()
        && VDRest.config.getItem('useHtmlPlayer')
        && VDRest.config.getItem('streamdevParams').indexOf('EXT') > -1;
};

/**
 * @returns {boolean}
 */
VDRest.Info.Model.Info.prototype.canRemuxRecordings = function () {

    var streamer = this.getStreamer();

    return streamer && streamer.versnum >= this.minRemuxRecordingsVersnum;
};

/**
 * @returns {Object}
 */
VDRest.Info.Model.Info.prototype.getStreamer = function () {

    return VDRest.config.getItem('streamdevActive') && this.getPlugin('streamdev-server');
};

/**
 * get resource, load info
 */
VDRest.Info.Model.Info.prototype.load = function () {

    this.getResource().load({
        "url" : "info",
        "method" : "GET",
        "callback": function (e) {

            var i;

            for (i in e) {

                if (e.hasOwnProperty(i)) {

                    this.setData(i, e[i]);
                }
            }

            $.event.trigger('infoupdate');

        }.bind(this)
    });
};

/**
 * retrieve info about plugin
 * @returns {Object}
 */
VDRest.Info.Model.Info.prototype.getPlugin = function (name) {

    var plugins = this.getData('vdr').plugins, i;

    for (i in plugins) {

        if (plugins.hasOwnProperty(i) && plugins[i].name === name) {

            plugins[i].versnum = this.getPluginVersnum(plugins[i]);
            return plugins[i];
        }
    }
    return false;
};

/**
 * retrieve info about plugin
 * @returns {Object}
 */
VDRest.Info.Model.Info.prototype.hasPlugin = function (name) {

    return !!this.getPlugin(name);
};

/**
 * normalize version number
 * Version * 10000 + Major * 100 + Minor
 * @param {Object} plugin
 * @returns {number}
 */
VDRest.Info.Model.Info.prototype.getPluginVersnum = function (plugin) {

    var version = plugin.version.replace(/[^.0-9]/g, '').split('.');

    return parseInt(version[0], 10) * 10000
            + parseInt(version[1], 10) * 100
            + parseInt(version[2], 10);
};

/**
 * retrieve info resource model
 * @returns {VDRest.Info.Model.Info.Resource}
 */
VDRest.Info.Model.Info.prototype.getResource = function () {

    return this.module.getResource('Info');
};
