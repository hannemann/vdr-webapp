/**
 * @class
 * @constructor
 */
Gui.Timer.Controller.List = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Timer.Controller.List.prototype = new VDRest.Abstract.Controller();

/**
 * retrieve List items
 */
Gui.Timer.Controller.List.prototype.init = function () {

    this.view = this.module.getView('List');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    this.timerList = VDRest.Lib.Object.prototype.getInstance();

    this.dataModel = VDRest.app.getModule('VDRest.Timer').getModel('List');
};

/**
 * dispatch views, init event handling
 */
Gui.Timer.Controller.List.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();

    if (this.dataModel.getCollection().length > 0) {

        this.iterateTimers({
            "iterate": this.dataModel.collectionIterator.bind(this.dataModel),
            "collection" : this.dataModel.getCollection()
        });
    } else {

        this.dataModel.initList();
    }

    $.event.trigger('timerlist.dispatched');
};

/**
 * iterate data model collection
 * @param {object} collection
 */
Gui.Timer.Controller.List.prototype.iterateTimers = function (collection) {

    collection.iterate(function (timerModel) {

        this.timerList.setData(

            timerModel.data.id,

            this.module.getController('List.Timer', {
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
Gui.Timer.Controller.List.prototype.dispatchList = function () {

    this.timerList.each(function () {

        arguments[1].dispatchView();
    });
};

/**
 * add event listeners
 */
Gui.Timer.Controller.List.prototype.addObserver = function () {

    $(document).one('timersloaded', this.iterateTimers.bind(this));
};

/**
 * remove event listeners
 */
Gui.Timer.Controller.List.prototype.removeObserver = function () {};

/**
 * destroy
 */
Gui.Timer.Controller.List.prototype.destructView = function () {

    this.timerList.each(function () {

        arguments[1].destructView();
    });

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};