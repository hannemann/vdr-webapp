GuiTreeView = function () {
    this.index = {};
};

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
 * parentNode setter
 * @param parentNode
 * @return {*}
 */
GuiTreeView.prototype.setParentNode = function (parentNode) {
    this.parentNode = parentNode;
    return this;
};

/**
 * sort and render
 */
GuiTreeView.prototype.render = function () {

    $(this.items).sort(this.sortByName).each($.proxy(function () {

        this.renderRecursive(arguments[1], this.parentNode, this.index);
    }, this));

    this.moveFoldersToTop();

//    $('li.folder-header li, li.folder-header ul').remove();
};

/**
 * Move Folders to the Top of their parentnode
 */
GuiTreeView.prototype.moveFoldersToTop = function () {

    var children = this.parentNode.children('li.list-item').removeClass('collapsed collapsible');

    this.parentNode.children('li.folder')
        .sort(this.sortByDataNameAttribute)
        .detach().prependTo(this.parentNode)
        .children('.collapsible').removeClass('collapsed collapsible')
    ;

//    this.parentNode.find('li.folder-content').each($.proxy(function (k, v) {
//
//        var that = $(v);
//        that.children('ul.collapsible')
//            .sort(this.sortByDataNameAttribute)
//            .detach()
//            .prependTo(that);
//    }, this));
//
//    $('.folder-header:visible, .folder-content:visible').sort(this.sortByDataNameAttribute).detach().prependTo(this.parentNode);
};

/**
 * Add Nodes to itemList recursively
 * @param paths Array
 * @param index Object
 * @param currentNode  {jQuery}
 * @param item {jQuery}
 */
GuiTreeView.prototype.renderRecursive = function (item, currentNode, index, paths) {

    var path,
        nextNode,
        nextIndex;

    paths = paths || item.paths();
    path = paths.shift();

    if (!item instanceof GuiListItem) {
        throw 'Argument item not of type GuiListItem in GuiTreeView.renderRecursive';
    }

    // path is not the last one of items paths array
    if ('undefined' !== typeof path) {

        // path hasn't been added yet
        if ('undefined' === typeof index[path]) {

            nextIndex = {};
            index[path] = nextIndex;

            nextNode = this.getFolderContent(path);

            if (currentNode == this.parentNode) {
                currentNode.append($('<li>')
                    .addClass('folder')
                    .attr('data-name', path)
                    .append(this.getFolderWrapper(path)
                    .append(nextNode)));
            } else {

                currentNode
                    .append(this.getFolderWrapper(path)
                    .append(nextNode));
            }

        } else {

            nextIndex = index[path];
            if (currentNode == this.parentNode) {

                nextNode = currentNode.children('li.folder[data-name="'+path+'"]')
                    .find('li.folder-content[data-name="'+path+'"]');
            } else {

                nextNode = currentNode.find('li.folder-content[data-name="'+path+'"]');
            }
        }

        this.renderRecursive(item, nextNode, nextIndex, paths);

    } else {

        // render item
        index[item.name()] = item;
        item.renderIn(currentNode);
    }
};

/**
 * create folder header dom
 * @param path
 * @return {*}
 */
GuiTreeView.prototype.getFolderHeader = function (path) {

    return this.addToggle(
        $('<li>')
            .text(path)
            .attr('data-name', path)
            .addClass('folder-header')
    );
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
 * Create folder content dom
 * @param path
 * @return {*}
 */
GuiTreeView.prototype.getFolderContent = function (path) {

    return $('<li>').attr('data-name', path).addClass('folder-content')
};

/**
 * create folder wrapper
 * @param path
 * @return {*}
 */
GuiTreeView.prototype.getFolderWrapper = function (path) {

    return $('<ul>')
        .addClass('collapsible collapsed')
        .attr('data-name', path)
        .append(this.getFolderHeader(path));
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