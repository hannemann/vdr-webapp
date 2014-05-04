/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Input = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.Input.prototype = new Gui.Window.Controller.Abstract();

/**
 * init view
 */
Gui.Window.Controller.Input.prototype.init = function () {

    this.eventPrefix = 'window.input';

    this.view = this.module.getView('Input', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Window.Controller.Input.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
    this.setPosition();
};

/**
 * adjust position in case keyboard pops up
 */
Gui.Window.Controller.Input.prototype.setPosition = function () {

    var winHeight = $(window).height(), height = this.view.node.height();

    this.view.node.css({
        "transition" : "top .2s",
        "top": parseInt((winHeight - height) / 2, 10) + 'px'
    });

};

/**
 * add event listeners
 */
Gui.Window.Controller.Input.prototype.addObserver = function () {

    this.view.ok.on('click', $.proxy(this.okAction, this));

    this.view.cancel.on('click', $.proxy(this.cancel, this));

    $(window).on("resize", $.proxy(this.setPosition, this));
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Input.prototype.removeObserver = function () {

    this.view.ok.off('click', $.proxy(this.okAction, this));

    this.view.cancel.off('click', $.proxy(this.cancel, this));

    $(window).off("resize", $.proxy(this.setPosition, this));
};

/**
 * handle confirm
 */
Gui.Window.Controller.Input.prototype.okAction = function () {

    var type = this.data.type, value;

    if ("string" === type || "number" === type) {

        value = this.setStringLike();
    }

    if ("enum" === type) {

        value = this.setEnum();
    }

    $.event.trigger({
        "type" : 'setting.changed',
        "payload" : {
            "field" : this.data.gui.attr('name'),
            "value" : value
        }
    });

    this.goBack();
};

/**
 * copy strings to target
 */
Gui.Window.Controller.Input.prototype.setStringLike = function () {

    var value = this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]').val();

    this.data.gui.val(value);

    return value;
};

/**
 * copy enum
 */
Gui.Window.Controller.Input.prototype.setEnum = function () {

    var value = this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]:checked').val();

    this.data.gui.val(value);

    return value;
};

/**
 * cancel action
 */
Gui.Window.Controller.Input.prototype.cancel = function () {

    this.goBack();
};

/**
 * destroy, trigger change
 */
Gui.Window.Controller.Input.prototype.goBack = function () {

    this.module.cache.invalidateClasses(this);

    history.back();
};