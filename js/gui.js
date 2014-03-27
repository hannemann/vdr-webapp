Gui = function () {
	this.drawerOpen = false;
	this.throbberShown = 0;
    this.noConfig = true;
};

Gui.prototype.init = function () {
	var me = this;
	this.throbber = $('#throbber');
	this.drawer = $('#drawer');
	this.drawer.find('.close').on('click', function () {
		me.closeDrawer();
	});
};

Gui.prototype.openDrawer = function () {
    var me = this;
	this.drawer.animate({"width":"50%"}, 'fast', 'swing', function () {
        main.destroy = function () {
            me.closeDrawer();
        };
        window.location.hash = '#show-drawer';
    });
	this.drawerOpen = true;
};

Gui.prototype.closeDrawer = function () {
	this.drawer.animate({"width":"0"}, 'fast');
	this.drawerOpen = false;
};

Gui.prototype.setCurrent = function (module) {
	$('.navi-button').removeClass('current');
	$('.navi-button.'+module).addClass('current');
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

