/**
 * @class
 * @constructor
 * @property {VDRest.Recordings.Model.List}
 * @property {Gui.Recordings.View.List} view
 */
Gui.Recordings.Controller.List = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Recordings.Controller.List.prototype = new VDRest.Abstract.Controller();

/**
 * retrieve List items
 */
Gui.Recordings.Controller.List.prototype.init = function () {

    this.view = this.module.getView('List');

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );

    this.initRecordingsList();
    this.dataModel = this.module.store.getModel('List');
};

/**
 * initialize recordings collection object
 * @returns {Gui.Recordings.Controller.List}
 */
Gui.Recordings.Controller.List.prototype.initRecordingsList = function () {

    this.recordingsList = VDRest.Lib.Object.prototype.getInstance();
    return this;
};

/**
 * dispatch views, init event handling
 */
Gui.Recordings.Controller.List.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    if (this.dataModel.hasCollection) {

        this.iterateRecordings();
    } else {

        $document.one(this.dataModel.events.collectionloaded, function () {

            this.iterateRecordings();
        }.bind(this))
    }

    this.addObserver();

    $.event.trigger('recordingslist.dispatched');
};

Gui.Recordings.Controller.List.prototype.addObserver = function () {

    if (VDRest.helper.isTouchDevice) {
        this.preventReloadHandler = this.preventScrollReload.bind(this);
        this.view.node.on('touchmove', this.preventReloadHandler);
    }

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};

Gui.Recordings.Controller.List.prototype.removeObserver = function () {

    if (VDRest.helper.isTouchDevice) {
        this.view.node.off('touchmove', this.preventReloadHandler);
    }

    Gui.Window.Controller.Abstract.prototype.removeObserver.call(this);
};

Gui.Recordings.Controller.List.prototype.reRender = function () {

    var children = VDRest.app.getModule('Gui.Recordings').cache.store.View['Window.Directory'], i;

    this.view.node.empty();
    this.view.renderFirstLevel();

    for (i in children) {
        if (children.hasOwnProperty(i)) {
            children[i].data.dispatch(children[i], true);
        }
    }
};

/**
 * refresh directory windows
 */
Gui.Recordings.Controller.List.prototype.refresh = function () {

    var directories = VDRest.app.getModule('Gui.Window').windows,
        scrollStates = [];

    directories.forEach(function (controller) {

        if (controller instanceof Gui.Recordings.Controller.Window.Directory) {
            scrollStates.push({
                "controller" : controller,
                "state" : controller.view.body[0].scrollTop
            });
            controller.empty();
        }

    }.bind(this));

    scrollStates.push({
        "controller" : this,
        "state" : this.view.node[0].scrollTop
    });
    this.removeItems().initRecordingsList();

    delete this.module.cache.store.ViewModel.List.tree;
    this.module.cache.invalidateClasses('List.Directory');
    this.module.cache.invalidateClasses('List.Recording');

    this.iterateRecordings();
    setTimeout(function () {
        directories.forEach(function (controller) {

            if (controller instanceof Gui.Recordings.Controller.Window.Directory) {
                controller.data.listItem = this.module.cache.store.View['List.Directory'][controller.data.path];

                if ("undefined" !== typeof controller.data.listItem) {
                    controller.view.data.dispatch = controller.data.listItem.renderItems.bind(controller.data.listItem);
                    controller.view.data.dispatch(controller.view);
                }
            }

        }.bind(this));

        scrollStates.forEach(function (o) {
            if (o.controller instanceof Gui.Recordings.Controller.List) {
                o.controller.view.node[0].scrollTop = o.state;
            } else {
                o.controller.view.body[0].scrollTop = o.state;
            }
        });

    }.bind(this), 100);
};

/**
 * iterate data model collection
 */
Gui.Recordings.Controller.List.prototype.iterateRecordings = function () {

    this.dataModel.collectionIterator(function (recordingsModel) {

        this.recordingsList.setData(
            recordingsModel.data.file_name,
            {
                "name": recordingsModel.data.name,
                "start_time": recordingsModel.data.event_start_time
            }
        );

    }.bind(this));

    this.dispatchList();
};

/**
 * dispatch first directory level
 */
Gui.Recordings.Controller.List.prototype.dispatchList = function () {

    if (!this.module.cache.store.ViewModel.List) {

        this.module.getViewModel('List', {
            "view": this.view,
            "resource": this.recordingsList
        });
    } else {
        this.module.cache.store.ViewModel.List.resource = this.recordingsList;
    }

    this.view.renderFirstLevel();
};

Gui.Recordings.Controller.List.prototype.removeItems = function () {

    var i,
        directories = this.cache['List.Directory'],
        recordings = this.cache['List.Recording'];

    for (i in directories) {
        if (directories.hasOwnProperty(i)) {
            directories[i].destructView();
        }
    }

    for (i in recordings) {
        if (recordings.hasOwnProperty(i)) {
            recordings[i].destructView();
        }
    }

    return this;
};

/**
 * Destroy
 */
Gui.Recordings.Controller.List.prototype.destructView = function () {

    this.view.node.one(this.animationEndEvents, function () {

        VDRest.Abstract.Controller.prototype.destructView.call(this);
    }.bind(this));

    this.view.node.toggleClass('collapse expand');
};