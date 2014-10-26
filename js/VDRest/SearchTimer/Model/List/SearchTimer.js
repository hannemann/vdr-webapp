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
