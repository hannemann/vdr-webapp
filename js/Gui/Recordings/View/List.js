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
 * default sorting method
 * @type {null}
 */
Gui.Recordings.View.List.prototype.defaultSort = null;

/**
 * initialize node
 */
Gui.Recordings.View.List.prototype.init = function () {

    this.setSorting();

    this.reverse = false;

    this.node = $('<div class="recordings-list simple-list clearer">');
};

/**
 * initialize node
 */
Gui.Recordings.View.List.prototype.setSorting = function (type) {

    type = type || 'alnum';

    if ('startTime' === type) {
        this.sortCallback = this.sortEvent;
    } else {
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

    this.tree.data.directories.sort(this.helper().sortAlpha);

    for (i; i<l; i++) {
        this.tree.data.directories[i].dispatchView();
    }
    return this;
};

Gui.Recordings.View.List.prototype.renderFiles = function () {

    var i= 0, l = this.tree.data.files.length;

    this.tree.data.files.sort(this.sortCallback);

    if (this.reverse) {
        this.tree.data.files.reverse();
    }

    for (i; i<l; i++) {
        this.tree.data.files[i].dispatchView();
    }
    return this;
};

Gui.Recordings.View.List.prototype.sortEvent = function (a, b) {

    a = a.data.start_time;
    b = b.data.start_time;

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};
