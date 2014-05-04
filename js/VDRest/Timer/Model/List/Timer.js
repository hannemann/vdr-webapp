/**
 * Channels resource
 * @constructor
 */
VDRest.Timer.Model.List.Timer = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Timer.Model.List.Timer.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Timer.Model.List.Timer.prototype._class = 'VDRest.Timer.Model.List.Timer';

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Timer.Model.List.Timer.prototype.flags = {

    "inactive"      :   0x0000,
    "is_active"     :   0x0001,
    "is_instant"    :   0x0002,
    "uses_vps"      :   0x0004

};

/**
 * @type {string}
 */
VDRest.Timer.Model.List.Timer.prototype.cacheKey = 'id';
