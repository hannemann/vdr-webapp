/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Drawer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Window.ViewModel.Drawer.prototype = new VDRest.Abstract.ViewModel();

Gui.Window.ViewModel.Drawer.prototype.init = function () {

    var me = this;

    this.view = this.data.view;

    this.view.getButtons = function () {

        return me.getButtons();
    }
};

/**
 * retrieve collection
 * @returns {VDRest.Lib.Object}
 */
Gui.Window.ViewModel.Drawer.prototype.getButtons = function () {

    var collection = VDRest.Lib.Object.prototype.getInstance(),
        i,
        modules = VDRest.app.modules,
        current = VDRest.app.current,
        module;

    collection.initData();

    for (i in modules) {

        if (current !== i && modules.hasOwnProperty(i) && modules[i].inDrawer && modules[i].headline) {

            module = modules[i].namespace+'.'+modules[i].name;

            collection.setData(module, {
                "headline" : modules[i].headline,
                "current" : current === module
            });
        }
    }

    return collection;
};