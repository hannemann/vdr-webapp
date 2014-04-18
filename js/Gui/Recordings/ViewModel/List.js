Gui.Recordings.ViewModel.List = function () {};

Gui.Recordings.ViewModel.List.prototype = new VDRest.Abstract.ViewModel();

Gui.Recordings.ViewModel.List.prototype.init = function () {

    var me = this;

    this.tree = null;

    this.resource = this.data.resource;

    this.data.view.getTree = function () {

        if (!me.tree) {

            me.getTree();
        }

        return me.tree;
    }
};

Gui.Recordings.ViewModel.List.prototype.getTree = function () {

    if (!this.tree) {

        this.tree = this.module.getController('List.Directory', {
            "path" : "root",
            "parent" : this.module.getController('List'),
            "name" : "root"
        });

        this.resource.each($.proxy(function (number, name) {

            this.current = {
                "number" : number,
                "name" : name
            };

            this.addToTree(this.current.name, this.tree);

        }, this));
    }
    console.log(this.tree);
};

Gui.Recordings.ViewModel.List.prototype.addToTree = function (filename, parentDir) {

    var paths = filename.split('~'), name, childNode;

    name = paths.shift();

    // we have a directory
    if (paths.length > 0) {

        filename = paths.join('~');

        childNode = this.getDirectory(
            parentDir.data.path + '~' + name,
            parentDir,
            name
        );

        // directory not set yet
        if (!this.hasChild(name, parentDir.data.directories)) {

            parentDir.data.directories.push(childNode);
        }

        this.addToTree(filename, childNode);

    } else {

        parentDir.data.files.push(this.getFile(this.current.name, parentDir, name));
    }
};

Gui.Recordings.ViewModel.List.prototype.getDirectory = function (path, parent, name) {

    return this.module.getController('List.Directory', {
        "path" : path,
        "parent" : parent,
        "name" : name
    });
};

Gui.Recordings.ViewModel.List.prototype.getFile = function (path, parent, name) {

    return this.module.getController('List.Recording', {
        "number" : this.current.number,
        "parent" : parent,
        "name" : name
    });
};

Gui.Recordings.ViewModel.List.prototype.hasChild = function (n, h) {

    var i=0; l = h.length;

    for (i;i<l;i++) {
        if (n === h[i].data.name) {
            return true;
        }
    }
    return false;
};