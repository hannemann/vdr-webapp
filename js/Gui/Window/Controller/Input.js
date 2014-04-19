
Gui.Window.Controller.Input = function () {};

Gui.Window.Controller.Input.prototype = new Gui.Window.Controller.Abstract();

Gui.Window.Controller.Input.prototype.init = function () {

    this.eventPrefix = 'window.input';

    this.view = this.module.getView('Input', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

Gui.Window.Controller.Input.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
    this.setPosition();
};

Gui.Window.Controller.Input.prototype.setPosition = function () {

    var winHeight = $(window).height(), height = this.view.node.height();

    this.view.node.css({
        "top": parseInt((winHeight - height) / 2, 10) + 'px'
    });

};

Gui.Window.Controller.Input.prototype.addObserver = function () {

    this.view.ok.on('click', $.proxy(this.ok, this));

    this.view.cancel.on('click', $.proxy(this.cancel, this));

    $(window).on("resize", $.proxy(this.setPosition, this));
};

Gui.Window.Controller.Input.prototype.removeObserver = function () {

    this.view.ok.off('click', $.proxy(this.ok, this));

    this.view.cancel.off('click', $.proxy(this.cancel, this));

    $(window).off("resize", $.proxy(this.setPosition, this));
};

Gui.Window.Controller.Input.prototype.ok = function () {

    var type = this.data.type;

    if ("string" === type || "number" === type) {

        this.setStringLike();
    }

    if ("enum" === type) {

        this.setEnum();
    }

    this.goBack();
};

Gui.Window.Controller.Input.prototype.setStringLike = function () {

    this.data.gui.val(
        this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]').val()
    );
};

Gui.Window.Controller.Input.prototype.setEnum = function () {

    this.data.gui.val(
        this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]:checked').val()
    );
};

Gui.Window.Controller.Input.prototype.cancel = function () {

    this.goBack();
};

Gui.Window.Controller.Input.prototype.goBack = function () {

    $.event.trigger('setting.changed');

    this.module.cache.invalidateClasses(this);

    history.back();
};
