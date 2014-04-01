Gui.Confirm.View = function (window) {
    this.window = window;
};

Gui.Confirm.View.prototype = new Gui.Window.View();

Gui.Confirm.View.constructor = Gui.Confirm.View;

Gui.Confirm.View.prototype.hasCloseButton = false;

Gui.Confirm.View.prototype.modal = true;

Gui.Confirm.View.prototype.wrapperClassName = 'confirm';

Gui.Confirm.View.prototype.locationHash = 'confirm';

/**
 * set maximum dimensions
 */
Gui.Confirm.View.prototype.setMaxDimension = function () {

    var center = this.getDefaultDimension();

    this.maxDimension = {
        "top" : parseInt(center.top, 10) - 60 + 'px',
        "right" : '50px',
        "bottom" : parseInt(center.bottom, 10) - 60 + 'px',
        "left" : '50px'
    };

    return this;
};
