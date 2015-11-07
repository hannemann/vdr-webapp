/**
 * @class
 * @constructor
 * @property {{}} data
 * @property {VDRest.Epg.Model.Channels.Channel.Broadcast} data.dataModel
 * @property {VDRest.Timer.Model.Model.List.Timer} data.dataModel.data.timer
 * @property {Gui.Epg.View.Broadcasts.List.Broadcast} view
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * @type {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.isVisible = true;

/**
 * initialize view
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.init = function () {

    this.eventNameSpace = this.module.namespace + '-' + this.module.name;

    this.epgController = this.module.getController('Epg');

    this.windowModule = this.module;

    if (this.data.dataModel.data.timer_exists) {
        this.module.store.getModel('Observer').registerTimer(this.data.dataModel);
    }

    this.view = this.module.getView('Broadcasts.List.Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "listController": this.data.parent,
        "position": this.data.position
    });
    this.view.setParentView(this.data.parent.view);

    this.module.getViewModel('Broadcasts.List.Broadcast', {
        "id" : this.data.id,
        "channel" : this.data.channel,
        "view" : this.view,
        "resource" : this.data.dataModel
    });

    this.view.decorate();
};

/**
 * determine if broadcast is currently visible
 * @returns {boolean}
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.isInView = function () {

    var metrics = this.epgController.getMetrics(),
        parentOffset = this.view.parentView.node.offset(),
        left = this.view.getLeft() + parentOffset.left,
        right = this.view.getRight() + parentOffset.left;

    return left < metrics.win.width && right > metrics.broadcasts.left;
};

Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.updateMetrics = function () {

    this.module.getViewModel('Broadcasts.List.Broadcast', this.keyInCache).calculateMetrics();
    this.view.needsUpdate = true;

    return this;
};

/**
 * request window
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.requestWindowAction = function () {

    this.module.mute();

    $.event.trigger({
        "type" : 'window.request',
        "payload" : {
            "module" : this.windowModule,
            "type" : "Window.Broadcast",
            "data" : this.data
        }
    })
};

/**
 * request menu
 * @param {Event} e
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.requestMenuAction = function (e) {

    var tExists = this.data.dataModel.data.timer_exists,
        tActive = this.data.dataModel.data.timer_active,
        buttons = {};

    buttons.set = {
        "label" : VDRest.app.translate((tExists ? 'Delete' : 'Add') + ' Timer'),
        "fn" : tExists ? this.deleteTimer.bind(this) : this.addTimer.bind(this)
    };

    if (tExists) {
        buttons.toggle = {
            "label": VDRest.app.translate((tActive ? 'Dea' : 'A') + 'ctivate Timer'),
            "fn": this.toggleTimer.bind(this)
        };

        buttons.editTimer = {
            "label" : VDRest.app.translate("Edit Timer"),
            "fn" : this.editTimer.bind(this)
        };
    }

    if ('Gui.Epg' === VDRest.app.getCurrent()) {
        buttons.search = {
            "label": VDRest.app.translate('Search similar'),
            "fn": this.performSearch.bind(this)
        };
    }

    buttons.imdb = {
        "label" : VDRest.app.translate("Search IMDB"),
        "fn" : this.performImdbSearch.bind(this)
    };

    if (e) {
        e.stopPropagation();
    }

    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "ItemMenu",
            "data": {
                "config": {
                    "header": this.data.dataModel.data.title,
                    "buttons": buttons
                }
            }
        }
    })
};

/**
 * perform epg search with similar title
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.performSearch = function () {

    VDRest.app.dispatch('Gui.EpgSearch', this.data.dataModel.data.title);
};

/**
 * perform imdb search with similar title
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.performImdbSearch = function () {

    window.open("http://www.imdb.com/find?s=tt&q="+encodeURIComponent(this.view.getTitle()));
};

/**
 * retrieve timer adapter
 * @return {VDRest.Api.TimerAdapter}
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.getTimerAdapter = function () {

    return new VDRest.Api.TimerAdapter(
        VDRest.app.getModule('VDRest.Epg').getModel(
            'Channels.Channel.Broadcast',
            this.keyInCache
        )
    );
};

/**
 * add timer
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.addTimer = function () {

    VDRest.app.getModule('VDRest.Timer').getResource('List.Timer')
        .addOrUpdateTimer(this.getTimerAdapter(), this.keyInCache);
};

/**
 * delete timer
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.deleteTimer = function () {

    VDRest.app.getModule('VDRest.Timer').getResource('List.Timer')
        .deleteTimer(this.getTimerAdapter(), this.keyInCache);
};

/**
 * toggle timer active state
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.toggleTimer = function () {

    VDRest.app.getModule('VDRest.Timer')
        .loadModel('List.Timer', this.data.dataModel.data.timer_id, function (timer) {

            timer.data.is_active = !timer.data.is_active;
            this.data.dataModel.data.timer_active = timer.data.is_active;
            this.data.dataModel.data.timer = timer;

            VDRest.app.getModule('VDRest.Timer')
                .getResource('List.Timer')
                .addOrUpdateTimer(
                    new VDRest.Api.TimerAdapter(this.data.dataModel),
                    this.data.dataModel.data.timer_id
                );

        }.bind(this));
};

/**
 * edit timer
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.editTimer = function () {

    VDRest.app.getModule('VDRest.Timer').loadModel(
        'List.Timer',
        this.data.dataModel.data.timer_id,
        function (timer) {
            $.event.trigger({
                "type": "window.request",
                "payload": {
                    "type": "Window.Timer",
                    "module" : VDRest.app.getModule('Gui.Timer'),
                    "data": {
                        "id": timer.data.id,
                        "resource": timer,
                        "activeTab": 'edit',
                        "dontDeleteListItem": true
                    }
                }
            });
        });
};

/**
 * handle click on timer add/delete button
 */
Gui.Epg.Controller.Broadcasts.List.Broadcast.prototype.handleTimer = function () {

    this.view.handleTimerExists(this.data.dataModel.data.timer_exists);
    this.view.handleTimerActive(this.data.dataModel.data.timer_active);
    this.view.handleIsRecording(this.view.getIsRecording());
};
