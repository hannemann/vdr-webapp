VDRest.Gui.Confirm = function () {};

VDRest.Gui.Confirm.prototype = new VDRest.Gui.Window();

VDRest.Gui.Confirm.prototype.windowWrapper = 'Gui';

VDRest.Gui.Confirm.prototype.viewWrapper = 'Confirm';

VDRest.Gui.Confirm.prototype.observeHash = true;

/**
 * fill with content
 */
VDRest.Gui.Confirm.prototype.appendChildren = function () {

    this.getBody().addClass('clearfix');
    this.addMessage();
    this.addButtons();
};

/**
 * appendButtons
 */
VDRest.Gui.Confirm.prototype.addButtons = function () {

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
VDRest.Gui.Confirm.prototype.addMessage = function () {

    $('<h2>')
        .addClass('message')
        .html(this.getData('message'))
        .appendTo(this.getHeader())
    ;

    return this;
};