
Gui.Window.Controller.Directory = function () {};

Gui.Window.Controller.Directory.prototype = new Gui.Window.Controller.Abstract();

Gui.Window.Controller.Directory.prototype.cacheKey = 'path';

Gui.Window.Controller.Directory.prototype.init = function () {

    this.eventPrefix = 'window.directory.' + this.data.path.replace(/\s/g, '.');

    this.view = this.module.getView('Directory', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

Gui.Window.Controller.Directory.prototype.destructView = function () {

    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    this.module.cache.invalidateAllTypes(this);
};