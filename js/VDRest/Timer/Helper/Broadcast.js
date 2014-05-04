/**
 * @class
 * @constructor
 */
VDRest.Timer.Helper.Broadcast = function () {};

/**
 * @type {VDRest.Abstract.Helper}
 */
VDRest.Timer.Helper.Broadcast.prototype = new VDRest.Abstract.Helper();

/**
 * try to match broadcast against timer
 *
 * @param {{}} timer
 * @param {{}} broadcast
 * @returns {boolean}
 */
VDRest.Timer.Helper.Broadcast.prototype.match = function (timer, broadcast) {

    return this.matchByAux(timer, broadcast)
            || this.matchByEventId(timer, broadcast)
            || this.matchByName(timer, broadcast);
};

/**
 * @param {{}} timer
 * @param {{}} broadcast
 * @returns {boolean}
 */
VDRest.Timer.Helper.Broadcast.prototype.matchByAux = function (timer, broadcast) {

    var broadcastCacheId = timer.aux.split('/');

    return (broadcastCacheId[0] === broadcast.channel && broadcastCacheId[0] === broadcast.id);

};

/**
 * @param {{}} timer
 * @param {{}} broadcast
 * @returns {boolean}
 */
VDRest.Timer.Helper.Broadcast.prototype.matchByEventId = function (timer, broadcast) {

    var vps_active = (
            timer.flags
            & VDRest.Timer.Model.List.Timer.prototype.flags.uses_vps
            ) === VDRest.Timer.Model.List.Timer.prototype.flags.uses_vps,

        startNormalized =
            vps_active
            && new Date(timer.start_timestamp)
            || new Date(
                new Date(timer.start_timestamp).getTime()
                + VDRest.config.getItem('recordingStartGap') * 1000
            ),

        stopNormalized =
            vps_active
            && new Date(timer.stop_timestamp)
            || new Date(
                new Date(timer.stop_timestamp).getTime()
                - VDRest.config.getItem('recordingEndGap') * 1000
            );

    return (
        broadcast.start_date >= startNormalized
        && broadcast.end_date <= stopNormalized
        && broadcast.timer_id === timer.id
    );

};

/**
 * @param {{}} timer
 * @param {{}} broadcast
 * @returns {boolean}
 */
VDRest.Timer.Helper.Broadcast.prototype.matchByName = function (timer, broadcast) {

    var filename = timer.filename.split('~').pop();

    return (filename === broadcast.title || filename === broadcast.short_text);

};