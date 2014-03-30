Gui = function () {
	this.drawerOpen = false;
	this.throbberShown = 0;
    this.noConfig = true;
};

Gui.prototype.name = 'gui';

Gui.prototype.init = function () {
	var me = this;
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

main.registerModule('Gui');

