/**
 * Timer Observer
 * @constructor
 */
VDRest.Timer.Model.Observer = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Timer.Model.Observer.prototype = new VDRest.Abstract.Model();

/**
 * register events
 */
VDRest.Timer.Model.Observer.prototype.init = function () {

    $(document).on('vdrest-api-actions.timer-created', $.proxy(this.addTimer, this));

    $(document).on('vdrest-api-actions.timer-updated', $.proxy(this.updateTimer, this));

    $(document).on('vdrest-api-actions.timer-deleted', $.proxy(this.deleteTimer, this));
};

/**
 * add timer to collection
 * @param e
 */
VDRest.Timer.Model.Observer.prototype.addTimer = function (e) {

    var timer = e.payload.timer, collection;

    collection = this.module.getModel('List').getCollection();

    timer.event_id = e.payload.broadcastId.split('/')[1];

    if (collection.length > 0) {

        collection.push(this.module.getModel('List.Timer', timer));
        collection.sort(VDRest.Timer.Model.List.prototype.sortByTime);
    }

    $.event.trigger({
        "type" : 'gui.timer-created.' + e.payload.broadcastId,
        "payload" : timer
    });
};

/**
 * update timer
 * @param e
 */
VDRest.Timer.Model.Observer.prototype.updateTimer = function (e) {

    var timer = e.payload.timer;

    $.event.trigger({
        "type" : 'gui.timer-updated.' + e.payload.broadcastId,
        "payload" : timer
    });
};

/**
 * remove timer from collection
 * @param e
 */
VDRest.Timer.Model.Observer.prototype.deleteTimer = function (e) {

    var timer;

    timer = this.getTimer(e.payload);

    if (timer) {

        this.module.getModel('List').deleteFromCollection(timer);
        delete timer.cache[e.payload];
    }

    $.event.trigger({
        "type" : 'gui.timer-deleted.' + e.payload,
        "payload" : false
    });
};

/**
 * retrieve timer from cache
 * @param keyInCache
 * @returns {*}
 */
VDRest.Timer.Model.Observer.prototype.getTimer = function (keyInCache) {

    var store = this.module.cache.store;

    if (
        store.Model
        && store.Model['List.Timer']
        && store.Model['List.Timer'][keyInCache]
    ) {

        return store.Model['List.Timer'][keyInCache];

    } else {

        return false;
    }
};