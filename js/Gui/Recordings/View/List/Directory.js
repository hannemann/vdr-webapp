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
Gui.Recordings.View.List.Directory.prototype.renderItems = function (parentView, omitObserver) {

    var i = 0, l,
        directories = this.getDirectories(),
        files = this.getFiles(),
        listView = this.module.getView('List');

    omitObserver = omitObserver || false;

    l = directories.length;

    directories.sort($.proxy(listView.sortCallback, listView));

    if (this.module.getView('List').reverse) {
        directories.reverse();
    }

    for (i; i<l; i++) {

        if (!(directories[i] instanceof Gui.Recordings.Controller.List.Directory)) {
            directories[i] = this.module.getController('List.Directory', directories[i]);
        }
        directories[i].view.setParentView({"node" : parentView.body});
        directories[i].dispatchView(undefined, omitObserver);
    }

    i = 0; l = files.length;

    files.sort($.proxy(listView.sortCallback, listView));

    if (listView.reverse) {
        files.reverse();
    }

    for (i; i<l; i++) {

        if (!(files[i] instanceof Gui.Recordings.Controller.List.Recording)) {
            files[i] = this.module.getController('List.Recording', files[i]);
        }

        files[i].view.setParentView({"node" : parentView.body});
        files[i].dispatchView(undefined, omitObserver);
    }
};
