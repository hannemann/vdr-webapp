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

    this.node = $('<div class="recordings-list simple-list clearer">');
};

/**
 * render first directory level
 */
Gui.Recordings.View.List.prototype.renderFirstLevel = function () {

    var i= 0, l;

    this.tree = this.getTree();

    this.tree.data.directories.sort(this.helper().sortAlpha);

    l = this.tree.data.directories.length;

    for (i; i<l; i++) {

        this.tree.data.directories[i].dispatchView();
    }

    this.tree.data.files.sort(this.helper().sortAlpha);

    i=0; l = this.tree.data.files.length;

    for (i; i<l; i++) {

        this.tree.data.files[i].dispatchView();
    }

    this.tree.dispatchView();
};