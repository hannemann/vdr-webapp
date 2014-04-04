VDRest.Gui.Confirm.View = function (window) {
    this.window = window;
};

VDRest.Gui.Confirm.View.prototype = new VDRest.Gui.Window.View();

VDRest.Gui.Confirm.View.constructor = VDRest.Gui.Confirm.View;

VDRest.Gui.Confirm.View.prototype.hasCloseButton = false;

VDRest.Gui.Confirm.View.prototype.modal = true;

VDRest.Gui.Confirm.View.prototype.wrapperClassName = 'confirm';

VDRest.Gui.Confirm.View.prototype.locationHash = 'confirm';

/**
 * set maximum dimensions
 */
VDRest.Gui.Confirm.View.prototype.setMaxDimension = function () {

    var center = this.getDefaultDimension();

    this.maxDimension = {
        "top" : parseInt(center.top, 10) - 60 + 'px',
        "right" : '50px',
        "bottom" : parseInt(center.bottom, 10) - 60 + 'px',
        "left" : '50px'
    };

    return this;
};
