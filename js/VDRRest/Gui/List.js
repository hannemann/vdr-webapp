VDRest.Gui.List = function () {

    VDRest.Api.call(this);
    this.itemList = null;
    this.wrapper = null;
    this.isDispatched = false;
    this.index = {};
    this.body = $('body');
    this.cache = {};
};

VDRest.Gui.List.prototype = new VDRest.Api();

VDRest.Gui.List.prototype.init = function () {};

/**
 * load and show list
 */
VDRest.Gui.List.prototype.dispatch = function () {

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
VDRest.Gui.List.prototype.destruct = function () {

    this.wrapper.removeClass(this.wrapperClass);
    this.itemList.empty();
    this.index = {};
};
