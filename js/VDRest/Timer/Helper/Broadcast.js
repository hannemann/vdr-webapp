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

    var broadcastCacheId = this.getAux(timer).split('/');

    return (broadcastCacheId[0] === broadcast.channel && parseInt(broadcastCacheId[1], 10) === broadcast.id);

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
                + VDRest.config.getItem('recordingStartMargin') * 1000
            ),

        stopNormalized =
            vps_active
            && new Date(timer.stop_timestamp)
            || new Date(
                new Date(timer.stop_timestamp).getTime()
                - VDRest.config.getItem('recordingEndMargin') * 1000
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

/**
 * @param {{}} timer
 * @returns {string}
 */
VDRest.Timer.Helper.Broadcast.prototype.getAux = function (timer) {

    var p = new DOMParser(),
        x = p.parseFromString(timer.aux, "text/xml"),
        channelId = x.getElementsByTagName('channel_id')[0],
        eventid = x.getElementsByTagName('eventid')[0];

    if (channelId && eventid && channelId.childNodes[0] && eventid.childNodes[0]) {
        return channelId.childNodes[0].textContent + '/' + eventid.childNodes[0].textContent;
    } else {
        return timer.aux
    }
};