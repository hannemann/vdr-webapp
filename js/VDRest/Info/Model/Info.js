/**
 * @typedef {{}} infoDiskUsage
 * @property {string} description_localized
 * @property {number} free_mb
 * @property {number} free_minutes
 * @property {number} used_percent
 */

/**
 * @typedef {{}} infoService
 * @property {string} name
 * @property {number} version
 */

/**
 * @typedef {{}} infoPlugin
 * @property {string} name
 * @property {string} version
 */

/**
 * @typedef {{}} infoDevice
 * @property {number} adapter
 * @property {boolean} atsc
 * @property {string} channel_id
 * @property {string} channel_name
 * @property {number} channel_nr
 * @property {boolean} dvb_c
 * @property {boolean} dvb_s
 * @property {boolean} dvb_t
 * @property {number} frontend
 * @property {boolean} has_ci
 * @property {boolean} has_decoder
 * @property {boolean} live
 * @property {string} name
 * @property {number} number
 * @property {boolean} primary
 * @property {number} signal_quality
 * @property {number} signal_strength
 * @property {string} type
 */

/**
 * @typedef {{}} infoVDR
 * @property {infoPlugin[]} plugins
 * @property {infoDevice[]} devices
 */

/**
 * @typedef {{}} infoData
 * @property {infoDiskUsage} diskusage
 * @property {infoService[]} services
 * @property {number} time
 * @property {infoVDR} vdr
 * @property {string} version
 *
 */

/**
 * @class
 * @constructor
 * @property {infoData} data
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
 * @returns {infoPlugin|boolean}
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
 * @param {string} name
 * @returns {infoPlugin|boolean}
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
 * @param {infoPlugin} plugin
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
