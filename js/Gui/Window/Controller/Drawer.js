/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Drawer = function () {};

/**
 *
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.Drawer.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {boolean}
 */
Gui.Window.Controller.Drawer.prototype.isDispatched = false;

/**
 * initialize view, set event prefix
 */
Gui.Window.Controller.Drawer.prototype.init = function () {

    this.eventPrefix = 'window.drawer';

    this.view = this.module.getView('Drawer', this.data);

    this.module.getViewModel('Drawer', {
        "view" : this.view
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Window.Controller.Drawer.prototype.dispatchView = function () {

    if (!this.isDispatched) {

        document.getElementsByTagName('BODY')[0].classList.add('drawer');

        Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

        this.addObserver();

        this.triggerAnimation();
    }
};

/**
 * trigger animation, set state
 */
Gui.Window.Controller.Drawer.prototype.triggerAnimation = function () {

    $.event.trigger('drawer.animate');

    if (!this.isDispatched) {

        document.getElementsByTagName('BODY')[0].classList.add('show');
        this.isDispatched = true;

    } else {

        document.getElementsByTagName('BODY')[0].classList.remove('show');
        document.getElementsByTagName('BODY')[0].classList.add('hide');
        this.isDispatched = false;
    }
};

/**
 * decide which callback to use on animation end
 */
Gui.Window.Controller.Drawer.prototype.animationCallback = function () {

    if (this.isDispatched) {

        this.triggerStateChanged();
    } else {

        this.destructCallback();
    }
};

/**
 * fire event that drawer state has changed
 */
Gui.Window.Controller.Drawer.prototype.triggerStateChanged = function () {

    $.event.trigger({
        "type" : "drawer.statechanged",
        "payload" : true
    });
};

/**
 * add event listeners
 */
Gui.Window.Controller.Drawer.prototype.addObserver = function () {

    var i = 0, l = this.view.buttons.length, me = this;

    for (i; i<l; i++) {

        if (!this.view.buttons[i].hasClass('current')) {

            this.view.buttons[i].one('click', this.handleStateChanged);
        }
    }

    $(document).one('drawer.statechanged', function () {

        $(document).one('click', me.handleStateChanged);
    });

    this.view.node.on(this.animationEndEvents, $.proxy(this.animationCallback, this));
};

/**
 * remove event listeners
 */
Gui.Window.Controller.Drawer.prototype.removeObserver = function () {

    var i = 0, l = this.view.buttons.length;

    for (i; i<l; i++) {

        if (!this.view.buttons[i].hasClass('current')) {

            this.view.buttons[i].off('click');
        }
    }

    $(document).off('drawer.statechanged', this.handleStateChanged);
    $(document).off('click', this.handleStateChanged);

    this.view.node.off(this.animationEndEvents);

};

/**
 * button provides data-module attribute
 * containing module name to be dispatched
 * close drawer only if not found
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.Drawer.prototype.handleStateChanged = function (e) {

    var request = $(this).attr('data-module');

    e.stopPropagation();

    history.back();

    $(document).one('drawer.statechanged', function () {

        if (request) {

            VDRest.app.dispatch(request);
        }
    });
};

/**
 * animation callback on destruction
 */
Gui.Window.Controller.Drawer.prototype.destructCallback = function () {

    Gui.Window.Controller.Abstract.prototype.destructView.call(this);

    document.getElementsByTagName('BODY')[0].classList.remove('hide');

    document.getElementsByTagName('BODY')[0].classList.remove('drawer');

    $.event.trigger({
        "type" : "drawer.statechanged",
        "payload" : false
    });
};

/**
 * DESTROY!
 */
Gui.Window.Controller.Drawer.prototype.destructView = function () {

    this.triggerAnimation();
};