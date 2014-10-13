/**
 * @class
 * @constructor
 */
VDRest.Recordings.Helper.Default = function () {};

/**
 * @type {VDRest.Abstract.Helper}
 */
VDRest.Recordings.Helper.Default.prototype = new VDRest.Abstract.Helper();

/**
 * collection of recordings
 * @type {null|[]}
 */
VDRest.Recordings.Helper.Default.prototype.collection = null;

/**
 * retrieve collection from list model
 * @returns {[]}
 */
VDRest.Recordings.Helper.Default.prototype.getCollection = function () {

    if (!this.collection) {

        this.collection = this.module.getModel('List').getCollection();
    }

    return this.collection;
};

/**
 * retrieve array of directory names
 * @returns {[]}
 */
VDRest.Recordings.Helper.Default.prototype.getDirectories = function () {

    var i = 0, collection = this.getCollection(), l = collection.length, directories = [];

    for (i; i<l; i++) {

        directories.push(collection[i].getData('name').split('~').slice(0, -1).join('~'));
    }

    return directories.unique().sort();
};

/**
 * retrieve recursive directory tree
 * @returns {*|{}}
 */
VDRest.Recordings.Helper.Default.prototype.getDirTree = function () {

    var fullPath, paths, path, i = 0, l, root = {}, directories = this.getDirectories();

    if ('' === directories[0]) {
        directories.shift();
    }

    l = directories.length;

    for (i; i<l; i++) {

        fullPath = directories.shift();

        paths = fullPath.split('~');

        path = paths.shift();

        if (!root[path]) {

            root[path] = {
                "fullPath" : path
            }
        }

        if (paths.length > 0) {

            root[path] = this.addDirTree(paths, root[path], fullPath);
            root[path].hasChildren = true;
        }
    }

    return root;
};

/**
 * add directory to tree
 * @param paths
 * @param root
 * @param {String} fullPath
 * @returns {*}
 */
VDRest.Recordings.Helper.Default.prototype.addDirTree = function (paths, root, fullPath) {

    var i = 0, l=paths.length, current = root;

    for (i;i<l;i++) {

        if (!current[paths[i]]) {
            current[paths[i]] = {
                "fullPath" : fullPath.split('~').slice(0, i+2).join('~')
            };
        }
        current = current[paths[i]];
        if (i < l-1) {
            current.hasChildren = true;
        }
    }

    return root;
};