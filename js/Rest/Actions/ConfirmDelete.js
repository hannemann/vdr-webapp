Actions.ConfirmDelete = function (message) {

    GuiItem.apply(this, [{"message":message}]);
    this.view = new Actions.ConfirmDelete.View(this);
};

Actions.ConfirmDelete.prototype = new Gui.Window();

Actions.ConfirmDelete.prototype.wrapperClassName = 'confirm';

Actions.ConfirmDelete.prototype.locationHash = 'confirm';

/**
 * maximum dimension of view
 * @type {Object}
 */
Actions.ConfirmDelete.prototype.maxDimension = {
    "top":null,
    "left":"50px",
    "bottom":null,
    "right":"50px"
};

/**
 * dispatch
 */
Actions.ConfirmDelete.prototype.dispatch = function () {

    this.domElement = this.view.dispatch();
    this.setMaxDimension();
    this.getBody().addClass('clearfix');
    this.addMessage();
    this.addButtons();

    Gui.Window.prototype.dispatch.apply(this);
};

Actions.ConfirmDelete.prototype.addButtons = function () {

    var wrapper = $('<ul>').addClass('clearfix'),
        confirm = $('<li>').addClass('confirm'),
        cancel = $('<li>').addClass('cancel');

    confirm.on('click', $.proxy(function () {
        $.event.trigger({
            "type":"confirm"
        });
        this.view.closeCallback();
    }, this)).text('OK').appendTo(wrapper);

    cancel.on('click', $.proxy(function () {

        this.view.closeCallback();
    }, this)).text('Cancel').appendTo(wrapper);

    wrapper.appendTo(this.getBody());

};

/**
 * set maximum dimensions
 */
Actions.ConfirmDelete.prototype.setMaxDimension = function () {

    var center = this.view.getDefaultDimension();

    this.maxDimension.top = parseInt(center.top, 10) - 75 + 'px';
    this.maxDimension.bottom = parseInt(center.bottom, 10) - 75 + 'px';
};



/**
 * add message to body
 * @return {*}
 */
Actions.ConfirmDelete.prototype.addMessage = function () {


    $('<h2>')
        .addClass('message')
        .html(this.getData('message'))
        .appendTo(this.getHeader())
    ;

    return this;
};