/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Drawer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Window.ViewModel.Drawer.prototype = new VDRest.Abstract.ViewModel();

/**
 * initialize view
 */
Gui.Window.ViewModel.Drawer.prototype.init = function () {

    this.view = this.data.view;

    this.initViewMethods();
};

/**
 * add view specific methods
 */
Gui.Window.ViewModel.Drawer.prototype.initViewMethods = function () {

    var me = this;

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

            if (
                "undefined" !== typeof modules[i].pluginDependency
                && !VDRest.info.getPlugin(modules[i].pluginDependency)
            ) {
                continue;
            }

            module = modules[i].namespace+'.'+modules[i].name;

            collection.setData(module, {
                "headline" : modules[i].headline,
                "current" : current === module
            });
        }
    }

    return collection;
};
