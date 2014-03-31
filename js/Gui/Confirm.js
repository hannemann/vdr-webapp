Gui.Confirm = function () {};

Gui.Confirm.prototype = new Gui.Window();

Gui.Confirm.prototype.windowWrapper = 'Gui';

Gui.Confirm.prototype.viewWrapper = 'Confirm';

/**
 * fill with content
 */
Gui.Confirm.prototype.appendChildren = function () {

    this.getBody().addClass('clearfix');
    this.addMessage();
    this.addButtons();
};

/**
 * appendButtons
 */
Gui.Confirm.prototype.addButtons = function () {

    var wrapper = $('<ul>').addClass('clearfix'),
        confirm = $('<li>').addClass('confirm'),
        cancel = $('<li>').addClass('cancel');

    confirm.on('click', $.proxy(function () {

        $.event.trigger({
            "type" : this.eventPrefix + ".close",
            "confirmed":true
        });

    }, this)).text('OK').appendTo(wrapper);

    cancel.on('click', $.proxy(function () {

        $.event.trigger({
            "type" : this.eventPrefix + ".close",
            "confirmed":false
        });

    }, this)).text('Cancel').appendTo(wrapper);

    wrapper.appendTo(this.getBody());

};

/**
 * add message to body
 * @return {*}
 */
Gui.Confirm.prototype.addMessage = function () {

    $('<h2>')
        .addClass('message')
        .html(this.getData('message'))
        .appendTo(this.getHeader())
    ;

    return this;
};