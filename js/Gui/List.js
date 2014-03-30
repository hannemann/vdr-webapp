Gui.List = function () {

    Rest.call(this);
    this.itemList = null;
    this.wrapper = null;
    this.isDispatched = false;
    this.index = {};
    this.body = $('body');
    this.cache = {};
};

Gui.List.prototype = new Rest();

Gui.List.prototype.init = function () {};

/**
 * load and show list
 */
Gui.List.prototype.dispatch = function () {

    if (!this.isDispatched) {

        this.wrapper = $('.item-list-wrapper');
        this.itemList = this.wrapper.find('ul');
        this.isDispatched = true;
    }

    this.wrapper.addClass(this.wrapperClass);
    this.load();
    $('.'+this.wrapperClass).show();
};

/**
 * remove itemlist from dom
 */
Gui.List.prototype.destruct = function () {

    this.wrapper.removeClass(this.wrapperClass);
    this.itemList.empty();
    this.index = {};
};
