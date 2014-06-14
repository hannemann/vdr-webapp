/**
 * @class
 * @constructor
 */
Gui.Recordings.View.List.Directory = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Recordings.View.List.Directory.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.Recordings.View.List.Directory.prototype.cacheKey = 'path';

/**
 * init nodes
 */
Gui.Recordings.View.List.Directory.prototype.init = function () {

    this.node = $('<div class="recordings-path list-item clearer">');

    this.name = $('<div class="name">').appendTo(this.node);
};

/**
 * render
 */
Gui.Recordings.View.List.Directory.prototype.render = function () {

    var nextSibling;

    if ("root" !== this.getName()) {

        this.name.text(this.getName());

    } else {

        this.name.remove();
        this.node.removeClass('recordings-path');
    }

    if (isNaN(this.position)) {

        this.node.appendTo(this.parentView.node);
    } else {

        nextSibling = this.parentView.node.find('.recordings-path:nth(' + this.position + ')');

        if (nextSibling.get(0)) {

            this.node.insertBefore(nextSibling);
        } else {

            this.node.insertAfter(this.parentView.node.find('.recordings-path:last'));
        }
        delete this.position;
    }

    this.isRendered = !this.isRendered;
};

/**
 * render items
 */
Gui.Recordings.View.List.Directory.prototype.renderItems = function () {

    var i = 0, l,
        directories = this.getDirectories(),
        files = this.getFiles();

    l = directories.length;

    directories.sort(this.helper().sortAlpha);

    for (i; i<l; i++) {

        directories[i].view.setParentView({"node" : this.parentView.body});
        directories[i].dispatchView();
    }

    i = 0; l = files.length;

    files.sort(this.helper().sortAlpha);

    for (i; i<l; i++) {

        files[i].view.setParentView({"node" : this.parentView.body});
        files[i].dispatchView();
    }
};
