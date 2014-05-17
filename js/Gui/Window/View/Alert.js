/**
 * @class
 * @constructor
 */
Gui.Window.View.Alert = function () {};

/**
 * @type {Gui.Window.View.Input}
 */
Gui.Window.View.Alert.prototype = new Gui.Window.View.Input();

/**
 * @type {boolean}
 */
Gui.Window.View.Alert.prototype.isModal = true;

/**
 * decorate and render
 */
Gui.Window.View.Alert.prototype.render = function () {

    this.addClasses().addMessage().addButtons();

    if (this.hasData('info')) {

        this.addInfo();
    }

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * add buttons
 * @returns {Gui.Window.View.Input}
 */
Gui.Window.View.Alert.prototype.addButtons = function () {

    this.cancel = $('<div class="button button-cancel">').appendTo(this.node);

    this.ok = $('<div class="button button-confirm">').text('OK').appendTo(this.node);

    return this;
};

/**
 * add message
 * @returns {Gui.Window.View.Alert}
 */
Gui.Window.View.Alert.prototype.addMessage = function () {

    this.message = $('<div class="alert-message">').text(VDRest.app.translate(this.data.message)).appendTo(this.body);

    return this;
};

/**
 * add info text
 * @returns {Gui.Window.View.Alert}
 */
Gui.Window.View.Alert.prototype.addInfo = function () {

    $('<div class="alert-info">').text(VDRest.app.translate(this.data.info)).appendTo(this.message);

    return this;
};