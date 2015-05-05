/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Abstract = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Window.Controller.Abstract.prototype = new VDRest.Abstract.Controller();

/**
 * init parentView
 */
Gui.Window.Controller.Abstract.prototype.init = function () {

    this.view.setParentView({
        "node" :$('body')
    });
};

/**
 * init parentView
 */
Gui.Window.Controller.Abstract.prototype.dispatchView = function () {

    var tabConfig, i;

    if (this.view.getTabConfig) {

        tabConfig = this.view.getTabConfig();

        if (this.data.activeTab) {

            for (i in tabConfig.tabs) {

                if (tabConfig.tabs.hasOwnProperty(i)) {

                    delete tabConfig.tabs[i].default;
                }
            }

            tabConfig.tabs[this.data.activeTab].default = true;
        }

        $.event.trigger({
            "type" : "tabs.request",
            "tabConfig" : tabConfig
        });
    }

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
};

/**
 * add event handler
 * add destroyer to VDRest.app
 */
Gui.Window.Controller.Abstract.prototype.addObserver = function () {

    if (this.view.closeButton) {

        this.view.closeButton.one('click', function () {

            history.back();
        });
    }
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Abstract.prototype.removeObserver = function () {

    if (this.view.closeButton) {

        this.view.closeButton.off('click');
    }
};

/**
 * adjust position in case keyboard pops up
 */
Gui.Window.Controller.Abstract.prototype.setPosition = function () {

    var winHeight = $window.height(), height = this.view.node.height(), top;

    if ("Input" === this.keyInCache) {
        top = '25%';
    } else {
        top = parseInt((winHeight - height) / 2, 10) + 'px';
    }

    this.view.node.css({
        "transition": "top .2s",
        "top": top
    });
};

/**
 * destroy
 */
Gui.Window.Controller.Abstract.prototype.destructView = function () {

    VDRest.Abstract.Controller.prototype.destructView.call(this);
    this.module.cache.flushByClassKey(this);
    $.event.trigger({
        "type" : "destruct.window-" + this.keyInCache
    });

    $document.off("destruct.window-" + this.keyInCache);
};
