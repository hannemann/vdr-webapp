/**
 * @typedef {{}} recordingsTreeDirectory
 * @property {String} path
 * @property {Gui.Recordings.Controller.List|recordingsTreeDirectory} parent
 * @property {String} name
 * @property {Number} oldest
 * @property {Number} newest
 * @property {[]} files
 * @property {[]} directories
 */

/**
 * @typedef {{}} recordingsTreeFile
 * @property {String} file_name
 * @property {recordingsTreeDirectory} parent
 * @property {String} name
 * @property {Number} start_time timestamp
 */
/**
 * @typedef {{}} recordingsTreeCurrent
 * @property {String} file_name
 * @property {String} name
 * @property {Number} start_time timestamp
 */

/**
 * @class
 * @constructor
 * @property {Object.<string,recordingsTreeDirectory>} directories
 * @property {Gui.Recordings.Controller.List.Directory} tree
 * @property {recordingsTreeCurrent} current
 */
Gui.Recordings.ViewModel.List = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Recordings.ViewModel.List.prototype = new VDRest.Abstract.ViewModel();

/**
 * initialize data
 */
Gui.Recordings.ViewModel.List.prototype.init = function () {

    var me = this;

    this.tree = null;

    this.initial = true;

    this.directories = {
        "root": {
            "path": "root",
            "parent": this.module.getController('List'),
            "name": "root",
            "files": [],
            "directories": [],
            "oldest": 0,
            "newest": 0
        }
    };

    this.resource = this.data.resource;

    /**
     * @returns {Gui.Recordings.Controller.List}
     */
    this.data.view.getTree = function () {

        if (!me.tree) {

            me.getTree();
        }

        return me.tree;
    }
};

/**
 * init tree
 */
Gui.Recordings.ViewModel.List.prototype.getTree = function () {

    if (!this.tree) {

        this.resource.each(function (file_name, data) {

            this.current = {
                "file_name": file_name,
                "name" : data.name,
                "start_time" : data.start_time
            };

            this.addToTree(this.current.name, this.directories.root);

        }.bind(this));

        this.tree = this.module.getController('List.Directory', this.directories.root);

        //delete this.directories;
        this.initial = false;
    }
};

/**
 * add file to tree recursively
 * @param {String} filename
 * @param {recordingsTreeDirectory} parentDir
 */
Gui.Recordings.ViewModel.List.prototype.addToTree = function (filename, parentDir) {

    var paths = filename.split('~'),
        name,
        childNode;

    if (parentDir instanceof Gui.Recordings.Controller.List.Directory) {
        parentDir = parentDir.data;
    }

    name = paths.shift();

    // we have a directory
    if (paths.length > 0) {

        filename = paths.join('~');

        childNode = this.getDirectory(
            parentDir.path + '~' + name,
            parentDir,
            name
        );

        // directory not set yet
        if (!this.hasChild(name, parentDir.directories)) {

            if (this.initial) {
                parentDir.directories.push(childNode);
            } else {
                parentDir.directories.push(this.module.getController('List.Directory', childNode));
            }
        }

        this.addToTree(filename, childNode);

    } else {

        parentDir.files.push(this.getFile(this.current.name, parentDir, name));
    }
};

/**
 * get directory controller
 * @param path
 * @param parent
 * @param name
 * @returns {recordingsTreeDirectory}
 */
Gui.Recordings.ViewModel.List.prototype.getDirectory = function (path, parent, name) {

    if (!this.directories[path]) {

        this.directories[path] = {
            "path": path,
            "parent": parent,
            "name": name,
            "oldest": 0,
            "newest": 0,
            "files": [],
            "directories": []
        };
    }

    return this.directories[path];
};

/**
 * get recordings controller
 * @param path
 * @param parent
 * @param name
 * @returns {recordingsTreeFile}
 */
Gui.Recordings.ViewModel.List.prototype.getFile = function (path, parent, name) {

    var current = parent;

    do {

        if (0 === current['newest'] || current['newest'] < this.current.start_time) {
            current['newest'] = this.current.start_time;
        }

        if (0 === current['oldest'] || current['oldest'] > this.current.start_time) {
            current['oldest'] = this.current.start_time;
        }

        if (current['parent']) {
            current = current['parent'];
        } else {
            current = null;
        }

    } while (current);

    return {
        "file_name": this.current.file_name,
        "parent" : parent,
        "name" : name,
        "start_time" : this.current.start_time
    };
};

/**
 * search child
 * @param {String} n needle
 * @param {recordingsTreeDirectory} h haystack
 * @returns {boolean}
 */
Gui.Recordings.ViewModel.List.prototype.hasChild = function (n, h) {

    var i = 0, l = h.length, name;

    for (i;i<l;i++) {
        if (h[i] instanceof Gui.Recordings.Controller.List.Directory) {
            name = h[i].data.name;
        } else {
            name = h[i].name;
        }
        if (n === name) {
            return true;
        }
    }
    return false;
};


/**
 * @name Gui.Recordings.View.List.Directory#getDirectories
 * @function
 * @returns {Object.<recordingsTreeDirectory>}
 */
/**
 * @name Gui.Recordings.View.List.Directory#getFiles
 * @function
 * @returns {Object.<recordingsTreeFile>}
 */
/**
 * @name Gui.Recordings.View.List.Directory#getName
 * @function
 * @returns String
 */
/**
 * @name Gui.Recordings.View.List.Directory#getNewest
 * @function
 * @returns Number
 */
/**
 * @name Gui.Recordings.View.List.Directory#getOldest
 * @function
 * @returns Number
 */
/**
 * @name Gui.Recordings.View.List.Directory#getParent
 * @function
 * @returns Gui.Recordings.Controller.List.Directory
 */
/**
 * @name Gui.Recordings.View.List.Directory#getPath
 * @function
 * @returns String
 */

/**
 * @name Gui.Recordings.View.List.Directory#setDirectories
 * @function
 * @param {Object.<recordingsTreeDirectory>}
 * @returns Gui.Recordings.View.List.Directory
 */
/**
 * @name Gui.Recordings.View.List.Directory#setFiles
 * @function
 * @param {Object.<recordingsTreeFile>}
 * @returns Gui.Recordings.View.List.Directory
 */
/**
 * @name Gui.Recordings.View.List.Directory#setName
 * @function
 * @param String
 * @returns Gui.Recordings.View.List.Directory
 */
/**
 * @name Gui.Recordings.View.List.Directory#setNewest
 * @function
 * @param Number
 * @returns Gui.Recordings.View.List.Directory
 */
/**
 * @name Gui.Recordings.View.List.Directory#setOldest
 * @function
 * @param Number
 * @returns Gui.Recordings.View.List.Directory
 */
/**
 * @name Gui.Recordings.View.List.Directory#setParent
 * @function
 * @param Gui.Recordings.Controller.List.Directory
 * @returns Gui.Recordings.View.List.Directory
 */
/**
 * @name Gui.Recordings.View.List.Directory#setPath
 * @function
 * @param String
 * @returns Gui.Recordings.View.List.Directory
 */

/**
 * @name Gui.Recordings.View.List.Directory#hasDirectories
 * @function
 * @returns Boolean
 */
/**
 * @name Gui.Recordings.View.List.Directory#hasFiles
 * @function
 * @returns Boolean
 */
/**
 * @name Gui.Recordings.View.List.Directory#hasName
 * @function
 * @returns Boolean
 */
/**
 * @name Gui.Recordings.View.List.Directory#hasNewest
 * @function
 * @returns Boolean
 */
/**
 * @name Gui.Recordings.View.List.Directory#hasOldest
 * @function
 * @returns Boolean
 */
/**
 * @name Gui.Recordings.View.List.Directory#hasParent
 * @function
 * @returns Boolean
 */
/**
 * @name Gui.Recordings.View.List.Directory#hasPath
 * @function
 * @returns Boolean
 */

