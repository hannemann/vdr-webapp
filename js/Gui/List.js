GuiList = function () {
    Rest.call(this);
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
    this.index = {};
};
