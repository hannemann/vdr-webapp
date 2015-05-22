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

    this.recordingsList = VDRest.Lib.Object.prototype.getInstance();

    this.dataModel = this.module.store.getModel('List');
};

/**
 * dispatch views, init event handling
 */
Gui.Recordings.Controller.List.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    if (this.isHidden) {

        this.isHidden = false;
        this.view.node.show();
        this.view.show();
    } else {

        this.view.show();
        if (this.dataModel.hasCollection) {

            this.iterateRecordings();
        } else {

            $document.one(this.dataModel.events.collectionloaded, function () {

                this.iterateRecordings();
            }.bind(this))
        }
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

    var children = VDRest.app.getModule('Gui.Window').cache.store.View.Directory, i;

    this.view.node.empty();
    this.view.renderFirstLevel();

    for (i in children) {
        if (children.hasOwnProperty(i)) {
            children[i].data.dispatch(children[i], true);
        }
    }
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

    this.module.getViewModel('List', {
        "view" : this.view,
        "resource" : this.recordingsList
    });

    this.view.renderFirstLevel();
};

/**
 * add folder to tree
 */
Gui.Recordings.Controller.List.prototype.createFolderFromFile = function (file) {

    var viewModel = this.module.getViewModel('List');

    viewModel.current = file;

    viewModel.addToTree(viewModel.current.name, viewModel.tree);
};

/**
 * traverse path up to root and remove all empty directories
 * @param {string} path
 */
Gui.Recordings.Controller.List.prototype.removeIfEmpty = function (path) {

    var dir, i, parentDirs;

    do {

        dir = this.module.getController('List.Directory', path);

        if (dir.data.files.length === 0 && dir.data.directories.length === 0) {

            dir.destructView();
            this.module.cache.invalidateAllTypes(dir);
            parentDirs = [];
            for (i=0; i < dir.data.parent.data.directories.length; i++) {

                if (dir.data.parent.data.directories[i] === dir) continue;
                parentDirs.push(dir.data.parent.data.directories[i]);
            }
            dir.data.parent.data.directories = parentDirs;
        }
        path = path.split('~');
        path.pop();
        path = path.join('~');

    } while (path.length > 0);
};

/**
 * Destroy
 */
Gui.Recordings.Controller.List.prototype.destructView = function () {

    this.view.node.one(this.animationEndEvents, function () {

        this.isHidden = true;
        this.view.node.hide();

        this.view.node.toggleClass('collapse collapsed');
    }.bind(this));

    this.view.node.toggleClass('collapse expand');
};