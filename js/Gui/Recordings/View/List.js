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

    var i, cMenu = VDRest.app.getModule('Gui.Recordings').contextMenu, sortState;

    this.setSorting(VDRest.config.getItem('defaultSorting'));

    sortState = this.sorting.indexOf('Desc') > -1;

    for (i in cMenu) {
        if (cMenu.hasOwnProperty(i) && i.indexOf('sort') === 0) {
            cMenu[i].state = sortState ? 'off' : 'on';
        }
    }

    this.node = $('<div class="recordings-list simple-list clearer">');
};

/**
 * initialize node
 */
Gui.Recordings.View.List.prototype.setSorting = function (type) {

    this.sorting = type;

    this.reverse = type.indexOf('Desc') > -1;
    if (type.indexOf('date') > -1) {
        this.sortCallback = this.sortEvent;
    } else if (type.indexOf('name') > -1) {
        this.sortCallback = this.helper().sortAlpha;
    }
};

/**
 * render first directory level
 */
Gui.Recordings.View.List.prototype.renderFirstLevel = function () {

    this.tree = this.getTree();

    this.renderDirectories().renderFiles();

    this.tree.dispatchView();
};

Gui.Recordings.View.List.prototype.renderDirectories = function () {

    var i= 0, l = this.tree.data.directories.length;

    this.tree.data.directories.sort($.proxy(this.sortCallback, this));

    if (this.reverse) {
        this.tree.data.directories.reverse();
    }

    for (i; i<l; i++) {
        this.tree.data.directories[i].dispatchView();
    }
    return this;
};

Gui.Recordings.View.List.prototype.renderFiles = function () {

    var i= 0, l = this.tree.data.files.length;

    this.tree.data.files.sort($.proxy(this.sortCallback, this));

    if (this.reverse) {
        this.tree.data.files.reverse();
    }

    for (i; i<l; i++) {
        this.tree.data.files[i].dispatchView();
    }
    return this;
};

Gui.Recordings.View.List.prototype.sortEvent = function (a, b) {

    if (a instanceof Gui.Recordings.Controller.List.Directory) {

        if (this.reverse) {
            a = a.data.newest;
            b = b.data.newest;
        } else {
            a = a.data.oldest;
            b = b.data.oldest;
        }

    } else {
        a = a.data.start_time;
        b = b.data.start_time;
    }

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};
