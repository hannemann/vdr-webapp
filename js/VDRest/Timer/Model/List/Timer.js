/**
 * @typedef {{}} timerData
 * @property {number} event_id
 * @property {number} flags
 * @property {number} index
 * @property {number} lifetime
 * @property {number} priority
 * @property {number} start
 * @property {number} stop
 * @property {boolean} is_active
 * @property {boolean} is_pending
 * @property {boolean} is_recording
 * @property {string} aux
 * @property {string} channel
 * @property {string} day
 * @property {string} filename
 * @property {string} id
 * @property {string} start_timestamp
 * @property {string} stop_timestamp
 * @property {string} weekdays
 * @property {string} channel_name
 */

/**
 * Channels resource
 * @constructor
 * @property {timerData} data
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

/**
 * delete Timer
 */
VDRest.Timer.Model.List.Timer.prototype.deleteTimer = function () {

    $window.one('vdrest-api-actions.timer-deleted', this.handleDelete.bind(this));

    this.module.getResource('List.Timer').deleteSearchTimer(this.data);
};

/**
 * handle deletion of a timer
 */
VDRest.Timer.Model.List.Timer.prototype.handleDelete = function () {

    var collection = this.module.getModel('List').collection;
    delete this.module.cache.store.Model['List.Timer'][this.data.id];
    collection.splice(collection.indexOf(this), 1);

    $.event.trigger({
        "type": "gui-timer.deleted",
        "payload": this.keyInCache
    });

    delete this;
};
