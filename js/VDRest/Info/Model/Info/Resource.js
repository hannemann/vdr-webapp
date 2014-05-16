/**
 * Info resource model
 * @constructor
 */
VDRest.Info.Model.Info.Resource = function () {};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.Info.Model.Info.Resource.prototype = new VDRest.Api.Resource();

/**
 * suppress displaying throbber
 * @type {boolean}
 */
VDRest.Info.Model.Info.Resource.prototype.noThrobber = true;

/**
 * @member {object} urls
 */
VDRest.Info.Model.Info.Resource.prototype.init = function () {

    this.urls = {
        "info" : "info.json"
    };
};