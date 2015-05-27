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
 * apply searchtimer filter
 * @param {number} id
 */
Gui.Timer.Controller.List.prototype.applySearchTimerFilter = function (id) {

    this.searchTimerId = id;
    return this;
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
                "id": timerModel.data.id,
                "parent": this,
                "dataModel": timerModel
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

        if (
            "undefined" === typeof this.searchTimerId ||
            (!isNaN(this.searchTimerId) && arguments[1].dataModel.isCreatedBySearchTimer(this.searchTimerId))
        ) {
            arguments[1].dispatchView();
        }
    }.bind(this));
    this.searchTimerId = undefined;
};

/**
 * retrieve searchtimer id
 * @param timer
 * @return {number|boolean}
 */
Gui.Timer.Controller.List.prototype.getSearchTimerId = function (timer) {

    var p = new DOMParser(),
        x = p.parseFromString(timer.dataModel.data.aux, "text/xml"),
        node = x.getElementsByTagName('s-id')[0],
        textNode,
        sId = false;

    if (node) {
        textNode = node.childNodes[0];
        if (textNode) {
            sId = parseInt(textNode.nodeValue, 10)
        }
    }

    return sId;
};

/**
 * add event listeners
 */
Gui.Timer.Controller.List.prototype.addObserver = function () {

    $document.one('timersloaded.guitimerlist', this.iterateTimers.bind(this));
    if (VDRest.helper.isTouchDevice) {
        this.preventReloadHandler = this.preventScrollReload.bind(this);
        this.view.node.on('touchmove', this.preventReloadHandler);
    }
};

/**
 * remove event listeners
 * @return {Gui.Timer.Controller.List}
 */
Gui.Timer.Controller.List.prototype.removeObserver = function () {

    $document.off('timersloaded.guitimerlist');
    if (VDRest.helper.isTouchDevice) {
        this.view.node.off('touchmove', this.preventReloadHandler);
    }

    return this;
};

/**
 * destroy timer nodes
 * @return {Gui.Timer.Controller.List}
 */
Gui.Timer.Controller.List.prototype.destroyTimers = function () {

    this.timerList.each(function () {

        arguments[1].destructView();
    });

    return this;
};

/**
 * destroy
 */
Gui.Timer.Controller.List.prototype.destructView = function () {

    this.view.node.one(this.animationEndEvents, function () {

        this.destroyTimers();

        VDRest.Abstract.Controller.prototype.destructView.call(this);
    }.bind(this));

    this.view.node.toggleClass('collapse expand');
};