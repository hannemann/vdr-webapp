/**
 * @class
 * @constructor
 */
Gui.Info.Controller.Default = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Info.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize
 */
Gui.Info.Controller.Default.prototype.init = function () {

    this.data.dataModel = this.module.store.getModel('Info');
    this.defaultUpdateSpeed = this.data.dataModel.module.interval;

    this.view = this.module.getView('Default', this.data);

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * dispatch
 */
Gui.Info.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.preventReload()
        .addObserver();
};

/**
 * add event listeners
 */
Gui.Info.Controller.Default.prototype.addObserver = function () {

    $window.on('infoupdate.infomodule', this.update.bind(this));
};

/**
 * remove event listeners
 */
Gui.Info.Controller.Default.prototype.removeObserver = function () {

    $window.off('infoupdate.infomodule');
};

/**
 * update view
 */
Gui.Info.Controller.Default.prototype.update = function () {

    var scrollState = this.view.node[0].scrollTop;
    this.view.setItems();
    this.view.node[0].scrollTop = scrollState;
};

/**
 * destroy
 */
Gui.Info.Controller.Default.prototype.destructView = function () {

    this.data.dataModel.module.interval = this.defaultUpdateSpeed;
    this.data.dataModel.module.toggleInfoUpdate();

    this.view.node.one(this.animationEndEvents, function () {

        VDRest.Abstract.Controller.prototype.destructView.call(this);
    }.bind(this));

    this.view.node.toggleClass('collapse expand');
};
