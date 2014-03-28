GuiList = function () {
    this.itemList = null;
    this.wrapper = null;
    this.isDispatched = false;
    this.index = {};
    this.body = $('body');
    this.cache = {};
};

GuiList.prototype = new Rest();

GuiList.prototype.init = function () {};

GuiList.prototype.dispatch = function () {
    if (!this.isDispatched) {
        this.wrapper = $('.item-list-wrapper');
        this.itemList = this.wrapper.find('ul');
        this.isDispatched = true;
    }
    this.wrapper.addClass(this.wrapperClass);
    this.load();
    $('.'+this.wrapperClass).show();
};

GuiList.prototype.destruct = function () {
    this.wrapper.removeClass(this.wrapperClass);
    this.itemList.empty();
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