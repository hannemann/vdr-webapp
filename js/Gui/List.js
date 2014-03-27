GuiList = function () {
    this.itemList = null;
    this.isDispatched = false;
    this.index = {};
    this.body = $('body');
};

GuiList.prototype = new Rest();

GuiList.prototype.init = function () {};

GuiList.prototype.dispatch = function () {
    if (!this.isDispatched) {
        this.itemList = $('.item-list-wrapper').addClass(this.wrapperClass).find('ul');
        this.load();
        this.isDispatched = true;
    }
    $('.'+this.wrapperClass).show();
};

GuiList.prototype.destruct = function () {
    this.itemList.removeClass(this.wrapperClass);
};

/**
 * Add Nodes to itemList recursively
 * @param paths Array
 * @param index Object
 * @param currentNode  {jQuery}
 * @param item {jQuery}
 */
GuiList.prototype.renderRecursive = function (paths, index, currentNode, item) {
    var path = paths.shift(), nextNode, nextIndex, folder;

    if ('undefined' !== typeof path) {

        if ('undefined' === typeof index[path]) {

            nextIndex = {};
            index[path] = nextIndex;
            folder = $('<li>')
                .text(path)
                .attr('data-toggle', path)
                .addClass('folder')
                .on('click', function () {
                    $(this).parent('ul')
                        .find('li[data-attribute="'+$(this).attr('data-toggle')+'"]:first > .collapsible')
                        .toggleClass('collapsed');
            });
            nextNode = $('<li>')
                .attr('data-attribute', path);
            currentNode.append(
                $('<ul>')
                    .addClass('collapsible' + (currentNode == this.itemList ? '' : ' collapsed'))
                    .append(folder)
                    .append(nextNode)
            );

        } else {

            nextIndex = index[path];
            nextNode = currentNode.find('li[data-attribute="'+path+'"]');
        }

        this.renderRecursive(paths, nextIndex, nextNode, item);

    } else {

        index[item.name()] = item;
        item.renderIn(currentNode);
    }
};