/**
 * @class
 * @property {object} collection
 * @property {object} data
 * @property {Object.<string[]>} timers
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

    $document.on('vdrest-api-actions.timer-deleted', this.handleTimerDeleted.bind(this));

    $document.on('vdrest-api-actions.timer-created', this.handleTimerCreated.bind(this));

    $document.on('vdrest-api-actions.timer-updated', this.handleTimerUpdated.bind(this));

};

/**
 * store broadcast id
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast} broadcast
 */
VDRest.Epg.Model.Observer.prototype.registerTimer = function (broadcast) {

    if (!this.timers[broadcast.data.timer_id]) {
        this.timers[broadcast.data.timer_id] = [];
    }
    if (this.timers[broadcast.data.timer_id].indexOf(broadcast.keyInCache) < 0) {
        this.timers[broadcast.data.timer_id].push(broadcast.keyInCache);
    }
};

/**
 * handle timer is deleted
 * @param {jQuery.Event} e
 * @param {string} e.payload
 */
VDRest.Epg.Model.Observer.prototype.handleTimerDeleted = function (e) {

    if (this.timers[e.payload]) {

        this.timers[e.payload].forEach(this.deleteTimer.bind(this));

        delete this.timers[e.payload];
    }
};

/**
 * delete timer
 * @param {string} broadcastKey
 */
VDRest.Epg.Model.Observer.prototype.deleteTimer = function (broadcastKey) {

    var model = this.getBroadcast(broadcastKey);

    if (model) {

        model.data.timer_exists = false;
        model.data.timer_active = false;
        model.data.timer_id = '';

        $.event.trigger({
            "type": 'gui-timer.deleted.epg',
            "payload": {
                "event": model.keyInCache
            }
        });
    }
};

/**
 * handle updated timer
 * @param e
 */
VDRest.Epg.Model.Observer.prototype.handleTimerUpdated = function (e) {

    var model = this.getBroadcast(e.payload.callerId);

    if (this.timers[e.payload.callerId]) {

        this.timers[e.payload.callerId].forEach(function (broadcastId) {

            model = this.getBroadcast(broadcastId);

            if (model) {

                model.data.timer_active = e.payload.timer.is_active;
                model.data.timer_id = e.payload.timer.id;

                this.registerTimer(model);

                $.event.trigger({
                    "type": 'gui-timer.updated.epg',
                    "payload": {
                        "event": model.keyInCache
                    }
                });
            }

        }.bind(this));
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

        this.registerTimer(model);

        $.event.trigger({
            "type": 'gui-timer.created',
            "payload": {
                "event": e.payload.callerId
            }
        });
    }
};

/**
 * retrieve broadcast from cache
 * @param keyInCache
 * @returns {VDRest.Epg.Model.Channels.Channel.Broadcast|boolean}
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