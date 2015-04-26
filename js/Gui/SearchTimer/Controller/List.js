/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.List = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.SearchTimer.Controller.List.prototype = new VDRest.Abstract.Controller();

/**
 * init view and datamodel
 */
Gui.SearchTimer.Controller.List.prototype.init = function () {

    this.view = this.module.getView('List');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    this.timerList = VDRest.Lib.Object.prototype.getInstance();

    this.channelgroups = {};

    this.dataModel = this.module.store.getModel('List');
};

/**
 * dispatch view, init event handling
 */
Gui.SearchTimer.Controller.List.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();

    if (this.dataModel.getCollection().length > 0) {

        this.iterateTimers({
            "iterate" : $.proxy(this.dataModel.collectionIterator, this.dataModel),
            "collection" : this.dataModel.getCollection()
        });
    } else {

        this.module.store.initList();
    }

    $.event.trigger('searchtimerlist.dispatched');
};

/**
 * iterate data model collection
 * @param {object} collection
 */
Gui.SearchTimer.Controller.List.prototype.iterateTimers = function (collection) {

    collection.iterate(function (timerModel) {

        this.timerList.setData(

            timerModel.data.id,

            this.module.getController('List.SearchTimer', {
                "id" : timerModel.data.id,
                "parent" : this,
                "dataModel" : timerModel
            })
        );

    }.bind(this));

    this.dispatchList();
};

/**
 * dispatch timers
 */
Gui.SearchTimer.Controller.List.prototype.dispatchList = function () {

    this.timerList.each(function () {

        arguments[1].dispatchView();
    });
};

/**
 * add event listeners
 */
Gui.SearchTimer.Controller.List.prototype.addObserver = function () {

    $document.one('searchtimersloaded', this.iterateTimers.bind(this));
    $document.one('channelgroupsloaded', this.storeChannelGroups.bind(this));
};

Gui.SearchTimer.Controller.List.prototype.storeChannelGroups = function (collection) {

    collection.iterate(function (channelgroup) {

        this.channelgroups[channelgroup.keyInCache] = {
            "label": channelgroup.data
        };

    }.bind(this));
};

/**
 * remove event listeners
 */
Gui.SearchTimer.Controller.List.prototype.removeObserver = function () {

    $(document).off('searchtimersloaded');
};

/**
 * destroy
 */
Gui.SearchTimer.Controller.List.prototype.destructView = function () {

    this.timerList.each(function () {

        arguments[1].destructView();
    });

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
