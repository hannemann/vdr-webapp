/**
 * Conflict model
 * @constructor
 */
VDRest.SearchTimer.Model.Conflicts.Conflict = function () {
};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.Conflicts.Conflict.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 */
VDRest.SearchTimer.Model.Conflicts.Conflict.prototype._class = 'VDRest.SearchTimer.Model.Conflicts.Conflict';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.Conflicts.Conflict.prototype.resultJSON = 'conflicts';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.Conflicts.Conflict.prototype.bypassCache = true;

/**
 * @typedef {{}} timerConflict
 * @property {Date} time
 * @property {number} timerId
 * @property {Array.<conflictingTimer>} conflictingTimers
 */

/**
 * @typedef {{}} conflictingTimer
 * @property {number} id
 * @property {number} percentage
 * @property {Array.<number>} timer
 */

/**
 * parse timer conflict string
 * @param {string} conflict
 * @returns {timerConflict}
 */
VDRest.SearchTimer.Model.Conflicts.Conflict.prototype.parseConflict = function (conflict) {

    var cArr;
    /** @type {timerConflict} */
    var data = {};

    var timer = VDRest.app.getModule('VDRest.timer');

    cArr = conflict.split(':');
    data.time = new Date(cArr.shift() * 1000);
    data.conflictingTimers = [];

    cArr.forEach(function (conflictData) {
        var c = conflictData.split('|');

        /** @type conflictingTimer */
        var conTimer = {
            "id" : c.shift(),
            "percentage" : c.shift(),
            "timer" : []
        };
        c.pop().split('#').forEach(function (id) {
            conTimer.timer.push(id);
        });
        data.conflictingTimers.push(conTimer);
    });

    return data;
};
