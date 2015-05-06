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
 */
VDRest.Timer.Model.List.Timer.prototype._class = 'VDRest.Timer.Model.List.Timer';

/**
 * @type {string}
 */
VDRest.Timer.Model.List.Timer.prototype.resultJSON = 'timers';

/**
 * flags
 * @type {{}}
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

/**
 * determine if timer is created by search timer with given id
 * @param {number} id
 * @return {boolean}
 */
VDRest.Timer.Model.List.Timer.prototype.isCreatedBySearchTimer = function (id) {

    var p = new DOMParser(),
        x = p.parseFromString(this.data.aux, "text/xml"),
        node = x.getElementsByTagName('s-id')[0],
        textNode,
        sId = false;

    if (node) {
        textNode = node.childNodes[0];
        if (textNode) {
            sId = parseInt(textNode.nodeValue, 10)
        }
    }

    return sId === id;
};
