/**
 * @class
 * @constructor
 */
Gui.Recordings.View.List = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Recordings.View.List.prototype = new VDRest.Abstract.View();

/**
 * initialize node
 */
Gui.Recordings.View.List.prototype.init = function () {

    var i, cMenu = VDRest.app.getModule('Gui.Recordings').contextMenu,
        currentSorting = VDRest.config.getItem('currentSorting'), sortState,
        node = $('.recordings-list');

    if (!currentSorting) {
        currentSorting = VDRest.config.getItem('defaultSorting');
    }

    this.setSorting(currentSorting);

    sortState = this.sorting.indexOf('Desc') > -1;

    for (i in cMenu) {
        if (cMenu.hasOwnProperty(i) && i.indexOf('sort') === 0) {
            cMenu[i].state = sortState ? 'off' : 'on';
        }
    }

    if (node.get(0)) {
        this.node = node;
    } else {
        this.node = $('<div class="recordings-list simple-list clearer">');
    }
};

/**
 * initialize node
 */
Gui.Recordings.View.List.prototype.setSorting = function (type) {

    this.sorting = type;

    VDRest.config.setItem('currentSorting', type);

    this.reverse = type.indexOf('Desc') > -1;
    if (type.indexOf('date') > -1) {
        this.sortCallback = this.sortEvent;
    } else if (type.indexOf('name') > -1) {
        this.sortCallback = this.sortAlpha;
    }
};

/**
 * render first directory level
 */
Gui.Recordings.View.List.prototype.renderFirstLevel = function () {

    this.tree = this.getTree();
    this.tree.view.node.empty();
    this.tree.dispatchView();

    setTimeout(function () {
        this.renderDirectories();
    }.bind(this), 20);
};

Gui.Recordings.View.List.prototype.renderDirectories = function () {

    var index = 0,
        length = this.tree.data.directories.length,
        interval;

    this.tree.data.directories.sort(this.sortCallback.bind(this));

    if (this.reverse) {
        this.tree.data.directories.reverse();
    }

    interval = setInterval(function () {

        index = this.renderChunk(index, 'List.Directory', this.tree.data.directories);

        if (index >= length) {
            clearInterval(interval);
            this.renderFiles();
        }

    }.bind(this), 10);
    return this;
};

Gui.Recordings.View.List.prototype.renderFiles = function () {

    var index = 0,
        length = this.tree.data.files.length,
        interval;

    this.tree.data.files.sort($.proxy(this.sortCallback, this));

    if (this.reverse) {
        this.tree.data.files.reverse();
    }

    interval = setInterval(function () {

        index = this.renderChunk(index, 'List.Recording', this.tree.data.files);

        if (index >= length) {
            clearInterval(interval);
        }

    }.bind(this), 10);
    return this;
};

Gui.Recordings.View.List.prototype.renderChunk = function (index, controller, tree) {

    var limit, chunkSize = 20;

    if (index + chunkSize > tree.length) {
        chunkSize -= (index + chunkSize) % tree.length;
    }

    limit = index + chunkSize;
    for (index; index < limit; index++) {
        this.module.getController(controller, tree[index]).dispatchView();
    }
    return index;
};

Gui.Recordings.View.List.prototype.sortEvent = function (a, b) {

    if (
        a instanceof Gui.Recordings.Controller.List.Directory ||
        a instanceof Gui.Recordings.Controller.List.Recording
    ) {
        a = a.data;
        b = b.data;
    }

    if (!a.start_time) {

        if (this.reverse) {
            a = a.newest;
            b = b.newest;
        } else {
            a = a.oldest;
            b = b.oldest;
        }

    } else {
        a = a.start_time;
        b = b.start_time;
    }

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};

/**
 * sort by name property
 * @param a
 * @param b
 * @returns {number}
 */
Gui.Recordings.View.List.prototype.sortAlpha = function (a, b) {

    if (
        a instanceof Gui.Recordings.Controller.List.Directory ||
        a instanceof Gui.Recordings.Controller.List.Recording
    ) {
        a = a.data;
        b = b.data;
    }

    a = a.name.toLowerCase().replace(/^[^a-z]/, '');
    b = b.name.toLowerCase().replace(/^[^a-z]/, '');

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};
