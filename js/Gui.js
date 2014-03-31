Gui = function () {
	this.drawerOpen = false;
	this.throbberShown = 0;
    this.noConfig = true;
};

Gui.prototype.name = 'gui';

Gui.prototype.init = function () {

	this.throbber = $('#throbber');
};

Gui.prototype.showThrobber = function () {
	if (this.throbberShown === 0) {
		this.throbber.show();
	}
	this.throbberShown++;
};

Gui.prototype.hideThrobber = function (force) {
	this.throbberShown--;
	if (this.throbberShown === 0 || force) {
		this.throbber.hide();
		this.throbberShown = 0;
	}
};

Gui.prototype.addModalOverlay = function (eventName) {

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

Gui.prototype.removeModalOverlay = function () {

    this.modalOverlay.remove();
};

main.registerModule('Gui');

