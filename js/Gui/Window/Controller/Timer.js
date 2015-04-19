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

    this.eventNameSpace = this.module.namespace + '-' + this.module.name;

    this.view = this.module.getView('Timer', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * load broadcast
 */
Gui.Window.Controller.Timer.prototype.getBroadcast = function (callback) {

    var broadcastHelper = VDRest.app.getModule('VDRest.Timer').getHelper('Broadcast');

    this.broadcast = new VDRest.Lib.Object();

    if (this.data.resource.event_id > 0) {

        VDRest.app.getModule('VDRest.Epg')
            .loadModel(
            'Channels.Channel.Broadcast',
            this.data.resource.channel + '/' + this.data.resource.event_id,
            function (broadcast) {

                this.broadcast = broadcast;
                callback();
            }.bind(this)
        );

    } else {

        $(document).one('broadcastsloaded-' + this.data.resource.channel, function (e) {

            var duration = 0, candidate = null;

            e.iterate(function (broadcast) {

                if (broadcastHelper.match(this.data.resource, broadcast.data)) {

                    this.broadcast = broadcast;

                    return false;
                }

                // match by longest duration as alternative
                if (duration < broadcast.data.duration) {

                    candidate = broadcast;
                    duration = broadcast.data.duration;
                }
            }.bind(this), function () {

                callback();
            }.bind(this));

            if (!this.broadcast) {

                this.broadcast = candidate;
            }
        }.bind(this));

        VDRest.app.getModule('VDRest.Epg').loadModel('Channels.Channel', this.data.resource.channel, function (channel) {

            channel.getByTime(
                new Date(this.data.resource.start_timestamp),
                new Date(this.data.resource.stop_timestamp)
            );
        }.bind(this));
    }
};

/**
 * dispatch view
 */
Gui.Window.Controller.Timer.prototype.dispatchView = function () {

    this.getBroadcast(function () {

        if (this.broadcast instanceof VDRest.Epg.Model.Channels.Channel.Broadcast) {

            this.view.setHasBroadcast();
            this.data.resource.event_id = this.broadcast.getData('id');
        }

        this.module.getViewModel('Timer', {
            "id": this.data.id,
            "view": this.view,
            "resource": this.data.resource,
            "broadcast": this.broadcast
        });

        Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

        this.addObserver();

        this.timerActiveAction();
    }.bind(this));
};

/**
 * add event listeners
 */
Gui.Window.Controller.Timer.prototype.addObserver = function () {

    if (this.view.hasBroadcast && this.view.hasBroadcastImages()) {

        this.view.image.on('click', this.animateImageAction.bind(this));
    }

    this.view.deleteButton.on('click', this.deleteTimer.bind(this));

    this.view.activateButton.on('click', this.toggleActivateTimer.bind(this));

    this.view.subToFilenameButton.on('click', this.view.subToFilename.bind(this.view));

    $(document).one('gui-timer.deleted.' + this.keyInCache + '.' + this.eventNameSpace, this.destroyTimer.bind(this));

    $(document).on('gui-timer.updated.' + this.keyInCache + '.' + this.eventNameSpace, this.update.bind(this));

    $(document).on("persisttimerchange-" + this.keyInCache, this.updateTimer.bind(this));

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Timer.prototype.removeObserver = function () {

    if (this.view.hasBroadcast && this.view.hasBroadcastImages()) {

        this.view.image.off('click');
    }

    this.view.deleteButton.off('click');

    this.view.activateButton.off('click');

    this.view.subToFilenameButton.off('click');

    $(document).off('gui-timer.' + this.keyInCache + '.' + this.eventNameSpace);

    $(document).off("persisttimerchange-" + this.keyInCache);
};

/**
 * trigger timer delete
 */
Gui.Window.Controller.Timer.prototype.deleteTimer = function () {

    this.vibrate();

    VDRest.app.getModule('VDRest.Timer')
        .getResource('List.Timer')
        .deleteTimer(this.getAdapter());
};

/**
 * trigger timer update at vdr
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

    if (fields.dirname.getValue() !== '') {

        updateData.data.filename = fields.dirname.getValue() + '~' + fields.filename.getValue();
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
            me.data.resource.filename = updateData.data.filename;
        });
};

/**
 * trigger update of involved models in cache etc.
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

    this.vibrate();

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
    if (!this.data.dontDeleteListItem) {
        VDRest.app.getModule('Gui.Timer').getController('List.Timer', this.keyInCache).destructView();
    }

    // destroy myself
    history.back();
};

/**
 * trigger image animation
 */
Gui.Window.Controller.Timer.prototype.animateImageAction = function () {

    this.vibrate();

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