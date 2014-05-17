/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Timer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.Timer.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.Timer.prototype.cacheKey = 'id';

/**
 * init view and view model
 */
Gui.Window.Controller.Timer.prototype.init = function () {

    this.eventPrefix = 'window.timer-' + this.data.id;

    this.view = this.module.getView('Timer', this.data);

    this.getBroadcast();

    this.module.getViewModel('Timer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.data.resource,
        "broadcast" : this.broadcast
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * load broadcast
 */
Gui.Window.Controller.Timer.prototype.getBroadcast = function () {

    var channel, me = this,
        broadcastHelper = VDRest.app.getModule('VDRest.Timer').getHelper('Broadcast');

    if (this.data.resource.event_id > 0) {

        this.broadcast = VDRest.app.getModule('VDRest.Epg')
            .loadModel(
            'Channels.Channel.Broadcast',
            this.data.resource.channel + '/' + this.data.resource.event_id
        );

    } else {

        $(document).one('broadcastsloaded-' + this.data.resource.channel, function (e) {

            var duration = 0, candidate = null;

            e.iterate(function (broadcast) {

                if (broadcastHelper.match(me.data.resource, broadcast.data)) {

                    me.broadcast = broadcast;

                    return false;
                }

                // match by longest duration as alternative
                if (duration < broadcast.data.duration) {

                    candidate = broadcast;
                    duration = broadcast.data.duration;
                }
            });

            if (!me.broadcast) {

                me.broadcast = candidate;
            }
        });

        channel = VDRest.app.getModule('VDRest.Epg').loadModel('Channels.Channel', this.data.resource.channel);

        channel.getByTime(
            new Date(this.data.resource.start_timestamp),
            new Date(this.data.resource.stop_timestamp),
            false
        );
    }

    if (this.broadcast instanceof VDRest.Epg.Model.Channels.Channel.Broadcast) {

        this.view.setHasBroadcast();
        this.data.resource.event_id = this.broadcast.getData('id');

    } else {

        this.broadcast = new VDRest.Lib.Object();
    }
};

/**
 * dispatch view
 */
Gui.Window.Controller.Timer.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();

    this.timerActiveAction();
};

/**
 * add event listeners
 */
Gui.Window.Controller.Timer.prototype.addObserver = function () {

    if (this.view.hasBroadcast && this.view.hasBroadcastImages()) {

        this.view.image.on('click', $.proxy(this.animateImageAction, this));
    }

    this.view.deleteButton.on('click', $.proxy(this.deleteTimer, this));

    this.view.activateButton.on('click', $.proxy(this.toggleActivateTimer, this));

    $(document).one('gui-timer.deleted.' + this.keyInCache, $.proxy(this.destroyTimer, this));

    $(document).one('gui-timer.updated.' + this.keyInCache, $.proxy(this.update, this));

    $(document).on("persisttimerchange-" + this.keyInCache, $.proxy(this.updateTimer, this));

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Timer.prototype.removeObserver = function () {

    if (this.view.hasBroadcast && this.view.hasBroadcastImages()) {

        this.view.image.off('click');
    }

    this.view.deleteButton.off('click', $.proxy(this.deleteTimer, this));

    this.view.activateButton.off('click', $.proxy(this.toggleActivateTimer, this));

    $(document).off('gui-timer.deleted.' + this.keyInCache, $.proxy(this.destroyTimer, this));

    $(document).off('gui-timer.updated.' + this.keyInCache, $.proxy(this.update, this));

    $(document).off("persisttimerchange-" + this.keyInCache, $.proxy(this.updateTimer, this));
};

/**
 * trigger timer delete
 */
Gui.Window.Controller.Timer.prototype.deleteTimer = function () {

    VDRest.app.getModule('VDRest.Timer')
        .getResource('List.Timer')
        .deleteTimer(this.getAdapter());
};

/**
 * trigger timer update
 */
Gui.Window.Controller.Timer.prototype.updateTimer = function (e) {

    var i, fields = e.payload,
        me = this,
        updateData = {
            "type" : "generic",
            "data":{},
            "broadcast" : this.broadcast,
            "resource" : this.data.resource
        },
        adapter;

    // todo: rollback user input in case of an error

    for (i in fields) {

        if (
            fields.hasOwnProperty(i)
            && me.data.resource.hasOwnProperty(i)
            && "function" === typeof fields[i].getValue
        ) {

            updateData.data[i] = fields[i].getValue();
        }
    }

    updateData.data.is_active = this.data.resource.is_active;

    adapter = new VDRest.Api.TimerAdapter(updateData);

    VDRest.app.getModule('VDRest.Timer')
        .getResource('List.Timer')
        .addOrUpdateTimer(adapter, this.keyInCache, function () {

            for (i in fields) {

                if (
                    fields.hasOwnProperty(i)
                    && me.data.resource.hasOwnProperty(i)
                    && "function" === typeof fields[i].getValue
                ) {

                    me.data.resource[i] = fields[i].getValue();
                }
            }
        });
};

/**
 * trigger update view
 */
Gui.Window.Controller.Timer.prototype.update = function (e) {

    var timer = e.payload,
        cache = this.module.cache.store;

    // update tabs
    $.event.trigger({
        "type" : "gui.tabs.update-" + this.keyInCache,
        "payload" : {
            "method" : "updateCacheKey",
            "args" : [timer.keyInCache]
        }
    });

    // update form
    $.event.trigger({
        "type" : "gui.form.update-" + this.keyInCache,
        "payload" : {
            "method" : "updateCacheKey",
            "args" : [timer.keyInCache]
        }
    });

    this.eventPrefix = 'window.timer-' + timer.keyInCache;

    this.data.id = timer.keyInCache;
    this.data.resource = timer.data;

    delete cache.Controller['Timer'][this.keyInCache];
    delete cache.View['Timer'][this.keyInCache];
    delete cache.ViewModel['Timer'][this.keyInCache];

    this.keyInCache = timer.keyInCache;
    cache.Controller['Timer'][this.keyInCache] = this;

    this.view.keyInCache = timer.keyInCache;
    cache.View['Timer'][this.keyInCache] = this.view;

    this.module.getViewModel('Timer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.data.resource,
        "broadcast" : this.broadcast
    });

    this.removeObserver();
    this.addObserver();
    this.timerActiveAction();

    this.view.update();
};

/**
 * trigger timer activate
 */
Gui.Window.Controller.Timer.prototype.toggleActivateTimer = function () {

    this.data.resource.is_active = !this.data.resource.is_active;

    VDRest.app.getModule('VDRest.Timer')
        .getResource('List.Timer')
        .addOrUpdateTimer(this.getAdapter(), this.keyInCache);
};

/**
 * retrieve TimerAdapter
 * @returns {VDRest.Api.TimerAdapter}
 */
Gui.Window.Controller.Timer.prototype.getAdapter = function () {

    return new VDRest.Api.TimerAdapter(this);
};

/**
 * toggle timer active
 */
Gui.Window.Controller.Timer.prototype.timerActiveAction = function () {

    this.view.handleTimerActive(this.data.resource.is_active);
};

/**
 * destroy timer
 */
Gui.Window.Controller.Timer.prototype.destroyTimer = function () {

    // delete list entry
    VDRest.app.getModule('Gui.Timer').getController('List.Timer', this.keyInCache).destructView();

    // destroy myself
    history.back();
};

/**
 * trigger image animation
 */
Gui.Window.Controller.Timer.prototype.animateImageAction = function () {

    this.view.animateImage();
};

/**
 * Destroy
 */
Gui.Window.Controller.Timer.prototype.destructView = function () {

    var me = this;

    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};