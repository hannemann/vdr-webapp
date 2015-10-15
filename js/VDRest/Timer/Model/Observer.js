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

    $document.on('vdrest-api-actions.timer-created', this.addTimer.bind(this));

    $document.on('vdrest-api-actions.timer-updated', this.updateTimer.bind(this));

    $document.on('vdrest-api-actions.timer-deleted', this.deleteTimer.bind(this));
};

/**
 * add timer to collection
 * @param e
 */
VDRest.Timer.Model.Observer.prototype.addTimer = function (e) {

    var timer = e.payload.timer, collection;

    collection = this.module.getModel('List').getCollection();

    timer.event_id = e.payload.callerId.split('/')[1];

    collection.push(this.module.getModel('List.Timer', timer));
    collection.sort(VDRest.Timer.Model.List.prototype.sortByTime);
};

/**
 * update timer
 * @param e
 */
VDRest.Timer.Model.Observer.prototype.updateTimer = function (e) {

    var timer = e.payload.timer, model;

    model = this.getTimer(e.payload.callerId);

    if (model) {

        model.data = timer;

        delete this.module.cache.store.Model['List.Timer'][model.keyInCache];

        model.keyInCache = timer.id;

        this.module.cache.store.Model['List.Timer'][model.keyInCache] = model;

        $.event.trigger({
            "type": 'gui-timer.updated.' + e.payload.callerId,
            "payload": model
        });
    }
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
        "type" : 'gui-timer.deleted.' + e.payload,
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