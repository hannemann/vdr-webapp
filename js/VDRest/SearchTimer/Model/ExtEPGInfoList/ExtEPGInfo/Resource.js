/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.ExtEPGInfo.Resource = function () {
};

/**
 * @type {VDRest.Api.Resource}
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.ExtEPGInfo.Resource.prototype = new VDRest.Api.Resource();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.ExtEPGInfo.Resource.prototype._class = 'VDRest.SearchTimer.Model.ExtEPGInfoList.ExtEPGInfo.Resource';

/**
 * url store
 * @type {Object.<String>}
 */
VDRest.SearchTimer.Model.ExtEPGInfoList.ExtEPGInfo.Resource.prototype.urls = {

    "exptEPGInfoList": "searchtimers/extepginfo.json"
};
