/**
 * conflicts collection
 * @constructor
 * @property {Array.<VDRest.SearchTimer.Model.Conflicts.Conflict>} collection
 * @property {[]} currentResult
 */
VDRest.SearchTimer.Model.Conflicts = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.Conflicts.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.SearchTimer.Model.Conflicts.prototype._class = 'VDRest.SearchTimer.Model.Conflicts';

/**
 * model to use for collection objects
 * @type {string}
 */
VDRest.SearchTimer.Model.Conflicts.prototype.collectionItemModel = 'Conflicts.Conflict';

/**
 * name of collection member in ajax result when loaded from API
 * @type {string}
 */
VDRest.SearchTimer.Model.Conflicts.prototype.resultCollection = 'conflicts';

/**
 * event to trigger when collection is loaded
 * @type {{collectionloaded: string}}
 */
VDRest.SearchTimer.Model.Conflicts.prototype.events = {

    "collectionloaded" : 'timerconflicts'
};

/**
 * initialize
 */
VDRest.SearchTimer.Model.Conflicts.prototype.init = function () {

    this.collection = [];
    this.currentResult = [];
};

/**
 * fetch resource model and load conflicts
 * fire callback afterwards
 */
VDRest.SearchTimer.Model.Conflicts.prototype.load = function () {

    this.collection = [];
    this.module.getResource(this.collectionItemModel).load({
        "url": 'timerconflicts',
        "callback": this.processCollection.bind(this)
    });
};

/**
 * @typedef {{}} conflictResult
 * @property {number} count
 * @property {number} total
 * @property {Array.<timerConflict|string>} conflicts
 * @property {boolean} check_advised
 */

/**
 * @param {conflictResult} result
 */
VDRest.SearchTimer.Model.Conflicts.prototype.processCollection = function (result) {

    result.conflicts.forEach(function (conflict, index) {
        result.conflicts[index] = VDRest.SearchTimer.Model.Conflicts.Conflict.prototype.parseConflict(conflict);
    }.bind(this));

    VDRest.Abstract.Model.prototype.processCollection.call(this, result);
};

/**
 * retrieve all timer ids as array
 * @return {Array.<number>}
 */
VDRest.SearchTimer.Model.Conflicts.prototype.getAllIds = function () {

    var result = [];
    this.collection.forEach(function (conflict) {

        conflict.data.conflictingTimers.forEach(function (ct) {
            ct.timer.forEach(function (i) {
                if (result.indexOf(i) < 0) {
                    result.push(i);
                }
            });
        });
    }.bind(this));
    return result.sort();
};
