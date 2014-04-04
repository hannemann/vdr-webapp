VDRest.Gui = function () {
	this.drawerOpen = false;
	this.throbberShown = 0;
    this.noConfig = true;
};

VDRest.Gui.prototype.name = 'gui';

VDRest.Gui.prototype.init = function () {

	this.throbber = $('#throbber');
};

VDRest.Gui.prototype.showThrobber = function () {
	if (this.throbberShown === 0) {
		this.throbber.show();
	}
	this.throbberShown++;
};

VDRest.Gui.prototype.hideThrobber = function (force) {
	this.throbberShown--;
	if (this.throbberShown === 0 || force) {
		this.throbber.hide();
		this.throbberShown = 0;
	}
};

VDRest.Gui.prototype.addModalOverlay = function (eventName) {

    $(document).one(eventName, $.proxy(this.removeModalOverlay, this));

    this.modalOverlay = $('<div>').css({
        "top":0,
        "right":0,
        "bottom":0,
        "left":0,
        "opacity":"0.5",
        "background-color":"#000000",
        "position":"fixed"
    }).appendTo($('body'));
};

VDRest.Gui.prototype.removeModalOverlay = function () {

    this.modalOverlay.remove();
};

VDRest.Gui.prototype.getElement = function (path, data) {

    return Lib.factory.getClass(path + '.Controller', data);
};

vdrest.registerModule('Gui');

