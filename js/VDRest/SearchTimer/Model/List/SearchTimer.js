/**
 * Channels resource
 * @constructor
 */
VDRest.SearchTimer.Model.List.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype._class = 'VDRest.SearchTimer.Model.List.SearchTimer';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.resultJSON = 'searchtimers';

/**
 * @type {Object.<String>}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.useChannel = {
    "NoChannel": 0,
    "Interval": 1,
    "Group": 2,
    "FTAOnly": 3
};

/**
 * @type {Object.<String>}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.searchModes = {
    "Phrase": 0,
    "all Words": 1,
    "one Word": 2,
    "Exact": 3,
    "Regular Expression": 4,
    "Fuzzy": 5
};

/**
 * flags
 * @type {{}}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.flags = {

    "inactive"      :   0x0000,
    "is_active"     :   0x0001,
    "is_instant"    :   0x0002,
    "uses_vps"      :   0x0004

};

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.cacheKey = 'id';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.init = function () {

    if ("" === this.data.id) {

    }
};
