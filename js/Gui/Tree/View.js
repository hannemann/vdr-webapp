GuiTreeView = function () {};

/**
 * Items Setter
 * @param items
 * @return {*}
 */
GuiTreeView.prototype.setItems = function (items) {
    this.items = items;
    return this;
};

/**
 * root setter
 * @param root
 * @return {*}
 */
GuiTreeView.prototype.setRoot = function (root) {
    this.root = root;
    return this;
};

/**
 * sort and render
 */
GuiTreeView.prototype.render = function () {

    $(this.items).sort(this.sortByName).each($.proxy(function () {

        this.renderRecursive(arguments[1], this.root);

    }, this));

    this.moveFoldersToTop();
    this.showRootItems();
};

/**
 * Move Folders to the Top of root
 */
GuiTreeView.prototype.moveFoldersToTop = function () {

    this.root.children('li.folder')
        .sort(this.sortByDataNameAttribute)
        .detach().prependTo(this.root);
};

GuiTreeView.prototype.showRootItems = function () {

    this.root.children('li.list-item').removeClass('collapsed collapsible');
    this.root.children('li.folder').children('.collapsible').removeClass('collapsed collapsible');
};

/**
 * Add Nodes to itemList recursively
 * @param item {GuiListItem}
 * @param currentNode  {*}
 * @param pathNames {Array}
 */
GuiTreeView.prototype.renderRecursive = function (item, currentNode, pathNames) {

    var pathName,
        nextNode;

    if (!item instanceof GuiListItem) {
        throw 'Argument item not of type GuiListItem in GuiTreeView.renderRecursive';
    }

    pathNames = pathNames || item.pathNames();
    pathName = this.getPathName(pathNames);

    if (pathName) {

        nextNode = this.getDirectory(currentNode, pathName);

        this.renderRecursive(item, nextNode, pathNames);

    } else {

        item.renderIn(currentNode);

    }
};

/**
 * find or create directory
 * @param currentNode
 * @param pathName
 * @return {*}
 */
GuiTreeView.prototype.getDirectory = function (currentNode, pathName) {

    var directory,
        selector = [],
        isRoot = this.isRoot(currentNode);

    if (isRoot) {

        selector.push('li.folder[data-name="'+pathName+'"]');
        selector.push('li.folder-content[data-name="'+pathName+'"]');

    } else {

        selector.push('ul[data-name="'+pathName+'"]');
        selector.push('li.folder-content[data-name="'+pathName+'"]');

    }

    directory = currentNode.find(selector.join(' '));

    if (0 === directory.length) {

        directory = this.createDirectory(currentNode, pathName);

    }

    return directory;
};

/**
 * determine if node is root
 * @param currentNode
 * @return {Boolean}
 */
GuiTreeView.prototype.isRoot = function (currentNode) {
    return currentNode === this.root;
};

/**
 * retrieve pathname
 * @param pathNames
 * @return {*}
 */
GuiTreeView.prototype.getPathName = function (pathNames) {
    var pathName = pathNames.shift();

    return "undefined" !== typeof pathName ? pathName : false;
};

/**
 * create new directory dom
 * @param currentNode
 * @param pathName
 * @return {*}
 */
GuiTreeView.prototype.createDirectory = function (currentNode, pathName) {

    var directoryContent = this.getDirectoryContent(pathName);

    this.getDirectoryWrapper(currentNode, pathName)
        .append(this.getDirectoryNode(pathName)
        .append(this.getDirectoryHeader(pathName))
        .append(directoryContent));

    return directoryContent;
};

/**
 * retrieve wrapper for directory
 * @param pathName
 * @return {*}
 */
GuiTreeView.prototype.getDirectoryWrapper = function (currentNode, pathName) {

    var wrapper;

    if (this.isRoot(currentNode)) {

        wrapper = $('<li>')
            .addClass('folder')
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
GuiTreeView.prototype.getDirectoryNode = function (pathName) {

    return $('<ul>')
        .addClass('collapsible collapsed')
        .attr('data-name', pathName);
};

/**
 * create directory header dom
 * @param pathName
 * @return {*}
 */
GuiTreeView.prototype.getDirectoryHeader = function (pathName) {

    return this.addToggle(
        $('<li>')
            .text(pathName)
            .attr('data-name', pathName)
            .addClass('folder-header')
    );
};

/**
 * Create folder content dom
 * @param pathName
 * @return {*}
 */
GuiTreeView.prototype.getDirectoryContent = function (pathName) {

    return $('<li>').attr('data-name', pathName).addClass('folder-content')
};

/**
 * add toggle to element
 * @param element
 * @return {*}
 */
GuiTreeView.prototype.addToggle = function (element) {

    return element
        .on('click', function () {
            $(this).parent('ul')
                .find('li.folder-content[data-name="'+$(this).attr('data-name')+'"]:first > .collapsible')
                .toggleClass('collapsed');
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
GuiTreeView.prototype.sortByName = function (a, b){
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
GuiTreeView.prototype.sortByDataNameAttribute = function (a, b){
    var aName = $(a).attr('data-name').toLowerCase();
    var bName = $(b).attr('data-name').toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
};