/**
 * @class
 * @constructor
 * @property {Gui.EpgSearch.Controller.Broadcasts.Broadcast[]} broadcastList
 */
Gui.EpgSearch.Controller.Broadcasts = function () {};

/**
 * @type {Gui.Epg.Controller.Broadcasts}
 */
Gui.EpgSearch.Controller.Broadcasts.prototype = new Gui.Epg.Controller.Broadcasts();

/**
 * @type {string}
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.itemController = 'Broadcasts.Broadcast';

/**
 * initialize list
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.init = function () {

    this.broadcastList = [];
    this.dateSeparators = [];

    this.view = this.module.getView('Broadcasts');
    this.setCurrentHour(new Date(1970, 0, 0));
};

/**
 * dispatch
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.dispatchView = function () {

    this.view.setParentView(
        this.data.parent.view
    );

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.addObserver = function () {

    $document.on('epgsearchcomplete', this.initResults.bind(this));

    this.pointerStartHandler = this.handleDown.bind(this);
    this.pointerMoveHandler = this.handleMove.bind(this);
    this.pointerEndHandler = this.handleUp.bind(this);
    this.view.node[0].addEventListener(VDRest.helper.pointerStart, this.pointerStartHandler);
    this.view.node[0].addEventListener(VDRest.helper.pointerMove, this.pointerMoveHandler);
    this.view.node[0].addEventListener(VDRest.helper.pointerEnd, this.pointerEndHandler);

    this.timerHandler = this.handleTimer.bind(this);
    $document.on('gui-timer.created', this.timerHandler);
    $document.on('gui-timer.updated.epg', this.timerHandler);
    $document.on('gui-timer.deleted.epg', this.timerHandler);
};

/**
 * remove event listeners
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.removeObserver = function () {

    $document.off('epgsearchcomplete');

    this.view.node[0].removeEventListener(VDRest.helper.pointerStart, this.pointerStartHandler);
    this.view.node[0].removeEventListener(VDRest.helper.pointerMove, this.pointerMoveHandler);
    this.view.node[0].removeEventListener(VDRest.helper.pointerEnd, this.pointerEndHandler);

    $document.off('gui-timer.created', this.timerHandler);
    $document.off('gui-timer.updated.epg', this.timerHandler);
    $document.off('gui-timer.deleted.epg', this.timerHandler);
};

/**
 * iterate resultCollection, dispatch results
 * @param resultCollection
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.initResults = function (resultCollection) {

    var i = 0, l = this.broadcastList.length;

    this.view.hideNoResults();

    for (i;i<l;i++) {

        this.broadcastList[i].destructView();
    }

    for (i = 0;i<this.dateSeparators.length;i++) {

        this.dateSeparators[i].destructView();
    }

    this.view.removeHeader();

    this.broadcastList = [];
    this.dateSeparators = [];

    if (resultCollection.collection.length > 0) {

        this.view.header(resultCollection.collection.length);

        resultCollection.iterate(function (dataModel) {

            var dataModelHours;

            dataModelHours = new Date(
                dataModel.data.start_date.getFullYear(),
                dataModel.data.start_date.getMonth(),
                dataModel.data.start_date.getDate(),
                dataModel.data.start_date.getHours(), 0, 0
            );

            if (dataModelHours.getTime() > this.currentHour.getTime()) {
                this.setCurrentHour(dataModel.data.start_date);
                this.addDateSeparator();
            }

            this.broadcastList.push(this.module.getController(this.itemController, {
                'channel': dataModel.data.channel,
                'id': dataModel.data.id,
                "parent": this,
                "dataModel": dataModel
            }));

            this.broadcastList[this.broadcastList.length - 1].dispatchView();
        }.bind(this));
    } else {

        this.view.showNoResults();
    }
};

/**
 * add date separator
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.addDateSeparator = function () {

    this.dateSeparators.push(this.module.getController('Broadcasts.DateSeparator', {
        "timestamp" : this.currentHour.getTime(),
        "channel_id" : this.data.channel_id,
        "parent" : this,
        "date" : this.currentHour,
        "position" : this.currentPosition++
    }));
    this.dateSeparators[this.dateSeparators.length - 1].dispatchView();
};

/**
 * set current hour
 * @param {Date} date
 * @returns {Gui.EpgSearch.Controller.Broadcasts}
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.setCurrentHour = function (date) {

    this.currentHour = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(), 0, 0
    );

    return this;
};

/**
 * delegate timer event to epg broadcast and window
 * @param {jQuery.Event} e
 * @param {{}} e.payload
 * @param {string} e.payload.event
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.handleTimer = function (e) {

    try {
        if (this.cache['Broadcasts.Broadcast'][e.payload.event]) {
            this.cache['Broadcasts.Broadcast'][e.payload.event].handleTimer();
        }
    } catch (e) {}
};

/**
 * destruct view
 */
Gui.EpgSearch.Controller.Broadcasts.prototype.destructView = function () {

    var i = 0,
        l = this.broadcastList.length;

    VDRest.Abstract.Controller.prototype.destructView.call(this);

    for (i;i<l;i++) {

        this.broadcastList[i].destructView();
    }

    for (i = 0;i<this.dateSeparators.length;i++) {

        this.dateSeparators[i].destructView();
    }
};