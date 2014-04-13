
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
};

Gui.Window.Controller.Input.prototype.addObserver = function () {

    this.view.ok.on('click', $.proxy(this.ok, this));

    this.view.cancel.on('click', $.proxy(this.cancel, this));
};

Gui.Window.Controller.Input.prototype.removeObserver = function () {

    this.view.ok.off('click', $.proxy(this.ok, this));

    this.view.cancel.off('click', $.proxy(this.cancel, this));
};

Gui.Window.Controller.Input.prototype.ok = function () {

    var type = this.data.type;

    if ("string" === type || "number" === type) {

        this.setStringLike();
    }

    if ("boolean" === type) {

        this.setBoolean();
    }

    history.back();
};

Gui.Window.Controller.Input.prototype.setStringLike = function () {

    this.data.gui.val(
        this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]').val()
    );
};

Gui.Window.Controller.Input.prototype.setBoolean = function () {

    console.log(this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]').prop('checked'));

    this.data.gui.get(0).checked = this.view.body.find('input[name="' + this.data.gui.attr('name') + '"]')
        .prop('checked');
};

Gui.Window.Controller.Input.prototype.cancel = function () {
    history.back();
};
