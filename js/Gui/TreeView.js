Gui.TreeView = function () {};

/**
 * Items Setter
 * @param items
 * @return {*}
 */
Gui.TreeView.prototype.setItems = function (items) {
    this.items = items;
    return this;
};

/**
 * root setter
 * @param root
 * @return {*}
 */
Gui.TreeView.prototype.setRoot = function (root) {
    this.root = root;
    return this;
};

/**
 * sort and render
 */
Gui.TreeView.prototype.render = function () {

    $(this.items).sort(this.sortByName).each($.proxy(function () {

        this.renderRecursive(arguments[1], this.root);

    }, this));

    this.moveFoldersToTop();
    this.showRootItems();
};

/**
 * Move Folders to the Top of root
 */
Gui.TreeView.prototype.moveFoldersToTop = function () {

    this.root.children('li.root-directory-item')
        .sort(this.sortByDataNameAttribute)
        .detach().prependTo(this.root);
};

/**
 * unhide root items
 */
Gui.TreeView.prototype.showRootItems = function () {

    this.root.children('li.root-list-item').removeClass('collapsed collapsible').addClass('expanded gui-tree-view-visible-item');
    this.root.children('li.root-directory-item')
        .children('.collapsible')
        .removeClass('collapsed collapsible')
        .addClass('expanded')
        .children('.directory-label')
        .addClass('gui-tree-view-visible-item');
};

/**
 * Add Nodes to itemList recursively
 * @param item {Gui.List.Item}
 * @param currentNode  {*}
 * @param pathNames {Array}
 */
Gui.TreeView.prototype.renderRecursive = function (item, currentNode, pathNames) {

    var pathName,
        nextNode,
        depth;

    if (!item instanceof Gui.List.Item) {
        throw 'Argument item not of type Gui.List.Item in Gui.TreeView.renderRecursive';
    }

    pathNames = pathNames || item.pathNames();
    pathName = this.getPathName(pathNames);
    depth = this.getDepth(item, pathNames);

    if (pathName) {

        nextNode = this.getDirectory(currentNode, pathName, depth);

        this.renderRecursive(item, nextNode, pathNames);

    } else {

        this.decorateItem(item, currentNode)
            .renderIn(currentNode);

    }
};

/**
 * @param item
 * @param currentNode
 * @return {*}
 */
Gui.TreeView.prototype.decorateItem = function (item, currentNode) {
    var dom = item.dom();

    if (this.isRoot(currentNode)) {
        dom.addClass('gui-tree-view-root-item root-list-item');
    }
    dom.addClass('list-item gui-tree-view-list-item');

    return item;
};

/**
 * get depth of directory
 * @param item
 * @param pathNames
 * @return {*}
 */
Gui.TreeView.prototype.getDepth = function (item, pathNames) {
    return item.pathNames().length - pathNames.length;
};

/**
 * find or create directory
 * @param currentNode
 * @param pathName
 * @return {*}
 */
Gui.TreeView.prototype.getDirectory = function (currentNode, pathName, depth) {

    var directory,
        selector = [],
        isRoot = this.isRoot(currentNode);

    if (isRoot) {

        selector.push('li.root-directory-item[data-name="'+pathName+'"]');
        selector.push('li.directory-content[data-name="'+pathName+'"]');

    } else {

        selector.push('ul[data-name="'+pathName+'"]');
        selector.push('li.directory-content[data-name="'+pathName+'"]');

    }

    directory = currentNode.find(selector.join(' '));

    if (0 === directory.length) {

        directory = this.createDirectory(currentNode, pathName, depth);

    }

    return directory;
};

/**
 * determine if node is root
 * @param currentNode
 * @return {Boolean}
 */
Gui.TreeView.prototype.isRoot = function (currentNode) {
    return currentNode === this.root;
};

/**
 * retrieve pathname
 * @param pathNames
 * @return {*}
 */
Gui.TreeView.prototype.getPathName = function (pathNames) {
    var pathName = pathNames.shift();

    return "undefined" !== typeof pathName ? pathName : false;
};

/**
 * create new directory dom
 * @param currentNode
 * @param pathName
 * @return {*}
 */
Gui.TreeView.prototype.createDirectory = function (currentNode, pathName, depth) {

    var directoryContent = this.getDirectoryContent(pathName);

    this.getWrapperNode(currentNode, pathName)
        .append(this.getDirectoryWrapper(pathName, depth)
        .append(this.getDirectoryLabel(pathName))
        .append(directoryContent));

    return directoryContent;
};

/**
 * retrieve wrapper for directory
 * @param pathName
 * @return {*}
 */
Gui.TreeView.prototype.getWrapperNode = function (currentNode, pathName) {

    var wrapper;

    if (this.isRoot(currentNode)) {

        wrapper = $('<li>')
            .addClass('gui-tree-view-root-item root-directory-item')
            .attr('data-name', pathName);

        currentNode.append(wrapper);

    } else {

        wrapper = currentNode;

    }

    return wrapper;
};

/**
 * create directory node
 * @param pathName
 * @return {*}
 */
Gui.TreeView.prototype.getDirectoryWrapper = function (pathName, depth) {

    return $('<ul>')
        .addClass('directory-wrapper collapsible collapsed')
        .attr('data-depth', depth.toString())
        .attr('data-name', pathName);
};

/**
 * create directory header dom
 * @param pathName
 * @return {*}
 */
Gui.TreeView.prototype.getDirectoryLabel = function (pathName) {

    return this.addToggle(
        $('<li>')
            .text(pathName)
            .attr('data-name', pathName)
            .addClass('directory-part directory-label')
    );
};

/**
 * Create directory content dom
 * @param pathName
 * @return {*}
 */
Gui.TreeView.prototype.getDirectoryContent = function (pathName) {

    return $('<li>').attr('data-name', pathName).addClass('directory-part directory-content')
};

/**
 * add toggle to element
 * @param element
 * @return {*}
 */
Gui.TreeView.prototype.addToggle = function (element) {

    return element
        .on('click', function () {
            var parent = $(this).parent('ul')

            parent.children('li.directory-part').toggleClass('on gui-tree-view-visible-item');
            parent.children('li.directory-content.on').children('.gui-tree-view-list-item').addClass('gui-tree-view-visible-item');
            parent.find('li.directory-content[data-name="'+$(this).attr('data-name')+'"]:first > .collapsible')
                .toggleClass('collapsed expanded');
        });
};

/**
 * sort callback
 * sortable must provide a name method
 *
 * @param a
 * @param b
 * @return {Number}
 */
Gui.TreeView.prototype.sortByName = function (a, b){
    var aName = a.name().toLowerCase();
    var bName = b.name().toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
};

/**
 * sort callback
 * sortable must be an element created by jQuery
 * and must have attribute data-name
 * @param a
 * @param b
 * @return {Number}
 */
Gui.TreeView.prototype.sortByDataNameAttribute = function (a, b){
    var aName = $(a).attr('data-name').toLowerCase();
    var bName = $(b).attr('data-name').toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
};