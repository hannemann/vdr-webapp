/**
 * @class
 * @property {object} collection
 * @property {object} data
 * @extends VDRest.Abstract.Model
 */
VDRest.Epg.Model.Observer = function () {};

/**
 * @type {VDRest.Model.Abstract}
 */
VDRest.Epg.Model.Observer.prototype = new VDRest.Abstract.Model();

/**
 * add event listeners
 */
VDRest.Epg.Model.Observer.prototype.init = function () {

    this.timers = {};

    $(document).on('vdrest-api-actions.timer-deleted', $.proxy(this.handleTimerDeleted, this));

    $(document).on('vdrest-api-actions.timer-created', $.proxy(this.handleTimerCreated, this));

    $(document).on('vdrest-api-actions.timer-updated', $.proxy(this.handleTimerUpdated, this));

};

/**
 * store broadcast id
 * @param broadcast
 */
VDRest.Epg.Model.Observer.prototype.registerTimer = function (broadcast) {

    this.timers[broadcast.data.timer_id] = broadcast.keyInCache;
};

/**
 * handle timer is deleted
 * @param {jQuery.Event} e
 */
VDRest.Epg.Model.Observer.prototype.handleTimerDeleted = function (e) {

    var model;

    if (this.timers[e.payload]) {

        model = this.getBroadcast(this.timers[e.payload]);

        delete this.timers[e.payload];

        if (model) {

            model.data.timer_exists = false;
            model.data.timer_active = false;
            model.data.timer_id = '';

            $.event.trigger({
                "type" : 'gui-timer-deleted.' + model.keyInCache,
                "payload" : model
            });
        }
    }
};

/**
 * handle updated timer
 * @param e
 */
VDRest.Epg.Model.Observer.prototype.handleTimerUpdated = function (e) {

    var model = this.getBroadcast(e.payload.callerId);

    if (this.timers[e.payload.callerId]) {

        model = this.getBroadcast(this.timers[e.payload.callerId]);

        delete this.timers[e.payload.callerId];

        if (model) {

            model.data.timer_active = e.payload.timer.is_active;
            model.data.timer_id = e.payload.timer.id;

            this.timers[e.payload.timer.id] = model.keyInCache;

            $.event.trigger({
                "type" : 'gui-timer-updated.' + model.keyInCache,
                "payload" : model
            });
        }
    }
};

/**
 * add timer to broadcast data model
 * @param e
 */
VDRest.Epg.Model.Observer.prototype.handleTimerCreated = function (e) {

    var model = this.getBroadcast(e.payload.callerId);

    if (model) {

        model.data.timer_exists = true;
        model.data.timer_active = e.payload.timer.is_active;
        model.data.timer_id = e.payload.timer.id;

        this.timers[e.payload.timer.id] = model.keyInCache;
    }
};

/**
 * retrieve broadcast from cache
 * @param keyInCache
 * @returns {*}
 */
VDRest.Epg.Model.Observer.prototype.getBroadcast = function (keyInCache) {

    var store = this.module.cache.store;

    if (
        store.Model
        && store.Model['Channels.Channel.Broadcast']
        && store.Model['Channels.Channel.Broadcast'][keyInCache]
    ) {

        return store.Model['Channels.Channel.Broadcast'][keyInCache];

    } else {

        return false;
    }
};