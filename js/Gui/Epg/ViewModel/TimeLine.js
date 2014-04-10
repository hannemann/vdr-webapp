/**
 * @class
 * @constructor
 *
 * @var {object} resource
 * @property {Date} start_date
 */
Gui.Epg.ViewModel.TimeLine = function () {};

/**
 * @type {VDRest.Lib.Cache.store.ViewModel}
 */
Gui.Epg.ViewModel.TimeLine.prototype = new VDRest.Abstract.ViewModel();

/**
 * pixels per second
 */
Gui.Epg.ViewModel.TimeLine.prototype.pixelPerSecond = VDRest.config.getItem('pixelPerSecond');

/**
 * init view methods
 */
Gui.Epg.ViewModel.TimeLine.prototype.init = function () {

    this.resource = {
        "start_date" : this.data.from
    };

    this.initViewMethods();
};