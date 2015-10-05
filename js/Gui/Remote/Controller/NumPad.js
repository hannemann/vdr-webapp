/**
 * @class
 * @constructor
 */
Gui.Remote.Controller.NumPad = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Remote.Controller.NumPad.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Remote.Controller.NumPad.prototype.init = function () {

    this.view = this.module.getView('NumPad');
};

/**
 * initialize view
 */
Gui.Remote.Controller.NumPad.prototype.dispatchView = function () {

    this.view.setParentView({
        "node" : this.defaultController.view.buttons
    });

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Remote.Controller.NumPad.prototype.addObserver = function () {

    if (VDRest.helper.isTouchDevice) {
        this.preventReloadHandler = this.preventScrollReload.bind(this);
        this.view.node.on('touchmove', this.preventReloadHandler);
    }
    this.view.one.on('click', this.defaultController.sendKey.bind(this.defaultController, '1'));
    this.view.two.on('click', this.defaultController.sendKey.bind(this.defaultController, '2'));
    this.view.three.on('click', this.defaultController.sendKey.bind(this.defaultController, '3'));
    this.view.four.on('click', this.defaultController.sendKey.bind(this.defaultController, '4'));
    this.view.five.on('click', this.defaultController.sendKey.bind(this.defaultController, '5'));
    this.view.six.on('click', this.defaultController.sendKey.bind(this.defaultController, '6'));
    this.view.seven.on('click', this.defaultController.sendKey.bind(this.defaultController, '7'));
    this.view.eight.on('click', this.defaultController.sendKey.bind(this.defaultController, '8'));
    this.view.nine.on('click', this.defaultController.sendKey.bind(this.defaultController, '9'));
    this.view.zero.on('click', this.defaultController.sendKey.bind(this.defaultController, '0'));
    this.view.txt.on('click', this.requestKbd.bind(this));
};

/**
 * remove event listeners
 */
Gui.Remote.Controller.NumPad.prototype.removeObserver = function () {

    this.view.one   .off('click');
    this.view.two   .off('click');
    this.view.three .off('click');
    this.view.four  .off('click');
    this.view.five  .off('click');
    this.view.six   .off('click');
    this.view.seven .off('click');
    this.view.eight .off('click');
    this.view.nine  .off('click');
    this.view.zero  .off('click');
    this.view.txt   .off('click');

    if (VDRest.helper.isTouchDevice) {
        this.view.node.off('touchmove', this.preventReloadHandler);
    }
};

/**
 * request user input
 */
Gui.Remote.Controller.NumPad.prototype.requestKbd = function () {

    var data = {
        "type": "string",
        "dom": $('<label class="clearer text">')
    };

    this.vibrate();

    $('<span>').text(VDRest.app.translate('Input Text')).appendTo(data.dom);
    data.gui = $('<input type="text" name="remote-txt">')
        .appendTo(data.dom);
    data.gui.on('change', this.sendKbd.bind(this));

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "module" : VDRest.app.getModule('Gui.Form'),
            "type" : "Window.Input",
            "data" : data
        }
    });
};

/**
 * send keyboard input
 */
Gui.Remote.Controller.NumPad.prototype.sendKbd = function (e) {

    this.module.backend.sendKbd(e.target.value);
};
