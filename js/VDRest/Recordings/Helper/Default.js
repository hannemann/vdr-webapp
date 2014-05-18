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

    var paths, path, i = 0, l, root = {}, directories = this.getDirectories();

    if ('' === directories[0]) {
        directories.shift();
    }

    l = directories.length;

    for (i; i<l; i++) {

        paths = directories.shift().split('~');

        path = paths.shift();

        if (!root[path]) {

            root[path] = {}
        }

        if (paths.length > 0) {

            root[path] = this.addDirTree(paths, root[path]);
        }
    }

    return root;
};

/**
 * add directory to tree
 * @param paths
 * @param root
 * @returns {*}
 */
VDRest.Recordings.Helper.Default.prototype.addDirTree = function (paths, root) {

    var i = 0, l=paths.length, current = root;

    for (i;i<l;i++) {

        if (!current[paths[i]]) {
            current[paths[i]] = {};
        }
        current = current[paths[i]];
    }

    return root;
};