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

    var sibling;

    if ("root" !== this.getName()) {

        this.name.text(this.getName());

    } else {

        this.name.remove();
        this.node.removeClass('recordings-path');
    }

    if (isNaN(this.position)) {

        this.node.appendTo(this.parentView.node);
    } else {

        sibling = this.parentView.node.find('.recordings-path:nth(' + this.position + ')');

        if (sibling.get(0)) {

            this.node.insertBefore(sibling);
        } else {

            sibling = this.parentView.node.find('.recordings-path:last');

            if (sibling.get(0)) {

                this.node.insertAfter(sibling);
            } else {

                this.node.prependTo(this.parentView.node);
            }
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

    files.sort(this.module.getView('List').sortCallback);

    if (this.module.getView('List').reverse) {
        files.reverse();
    }

    for (i; i<l; i++) {

        files[i].view.setParentView({"node" : this.parentView.body});
        files[i].dispatchView();
    }
};
