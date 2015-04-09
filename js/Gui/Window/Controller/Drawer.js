/**
 * @class
 * @constructor
 */
Gui.Window.Controller.Drawer = function () {};

/**
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

    this.data.favourites = VDRest.config.getItem('favourites');

    try {
        this.data.favourites = JSON.parse(this.data.favourites);
    } catch (e) {
        if (this.data.favourites) {
            this.data.favourites = [this.data.favourites];
        } else {
            this.data.favourites = [];
        }
    }

    this.view = this.module.getView('Drawer', this.data);

    this.indicator = VDRest.app.getModule('Gui.Menubar').getView('Default').drawerIndicator;

    this.vendor = TouchMove.Helper.getTransformVendorPrefix(this.view.node[0]);

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

        document.body.classList.add('drawer');

        Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

        this.addObserver();

        if ("undefined" !== typeof this.data.touchstart) {
            this.triggerPullStart();
        } else {
            setTimeout(this.triggerAnimation.bind(this), 20);
        }
    }
};

/**
 * trigger animation, set state
 */
Gui.Window.Controller.Drawer.prototype.triggerAnimation = function () {

    $.event.trigger('drawer.animate');

    if (!this.isDispatched) {

        document.body.classList.add('show');
        this.isDispatched = true;
        this.addNodeObserver();

    } else {

        this.removeShowClasses();
        document.body.classList.add('hide');
        this.view.node.one(this.transitionEndEvents, this.resetTransition.bind(this));
        this.resetTransform();
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

    if (this.view.favourites) {
        this.view.favourites.find('img')
            .on('mousedown', $.proxy(this.handleFavDown, this))
            .on('click', $.proxy(this.handleFavClick, this));
    }

    this.view.node.on(this.transitionEndEvents, this.animationCallback.bind(this));
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

    this.view.node
        .off(this.transitionEndEvents)
        .off('touchmove.drawer')
        .off('touchend');

    if (this.view.favourites) {
        this.view.favourites.find('img').off('click mousedown');
    }

};

/**
 * trigger start of sliding drawer open
 */
Gui.Window.Controller.Drawer.prototype.triggerPullStart = function () {

    this.data.deltaTouch = 0;
    document.body.classList.add('pull');
    $('body').on('touchmove.drawer', this.touchMove.bind(this))
        .one('touchend', this.touchEnd.bind(this));
    this.hasTouchEndObserver = true;
};

/**
 * handle drawer movement
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.Drawer.prototype.touchMove = function (e) {

    var clientX = e.originalEvent.changedTouches[0].clientX,
        maxWidth = this.getMaxWidth(), percentage, modalOpacity, indicatorWidth;

    if (!this.hasTouchEndObserver) {
        this.view.node.one('touchend', this.touchEnd.bind(this));
        this.hasTouchEndObserver = true;
    }

    this.pullDirection = 'left';

    if ("undefined" === typeof this.data.touchstart) {
        this.data.touchstart = clientX;
        this.data.deltaTouch = maxWidth - clientX;
    }

    if ("undefined" === typeof this.data.startTime) {
        this.data.startTime = Date.now();
    }

    if (this.nextPos > maxWidth - 10 - clientX - this.data.deltaTouch) {
        this.pullDirection = 'right';
    }

    this.nextPos = maxWidth - 10 - clientX - this.data.deltaTouch;

    if (this.nextPos < 0) {
        this.nextPos = 0;
    }

    if (this.nextPos > maxWidth) {
        this.nextPos = maxWidth;
    }

    percentage = (100 / maxWidth) * (maxWidth - this.nextPos);
    modalOpacity = .5 * percentage / 100;
    indicatorWidth = Math.round(11 - 6 * percentage / 100);

    this.view.node[0].style.transition = 'translate 0s linear';
    this.view.modalOverlay[0].style.transition = 'translate 0s linear';
    this.indicator[0].style.transition = 'translate 0s linear';
    this.view.node[0].style[this.vendor.jsStyle] = 'translate3d(-' + Math.abs(this.nextPos) + 'px, 0px, 0px)';
    this.view.modalOverlay[0].style.background = 'rgba(0,0,0,' + modalOpacity + ')';
    this.indicator[0].style.width = indicatorWidth + 'px';
};

/**
 * prepare finish drawer animation
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.Drawer.prototype.touchEnd = function (e) {

    var maxWidth = this.getMaxWidth(),
        remainDuration;

    this.touchend = e.originalEvent.changedTouches[0].clientX;
    document.body.classList.remove('pull');
    $('body').off('touchmove.drawer');
    this.view.node.off('touchmove touchend');

    remainDuration = this.getRemainDuration();
    this.view.node[0].style.transition = this.vendor.prefix + 'transform ' + remainDuration + 's linear';
    this.view.modalOverlay[0].style.transition = 'background ' + remainDuration + 's linear';
    this.indicator[0].style.transition = 'width ' + remainDuration + 's linear';
    this.data.touchstart = undefined;
    this.data.startTime = undefined;
    this.data.deltaTouch = 0;
    if ('right' === this.pullDirection && maxWidth - this.nextPos > maxWidth / 2) {

        this.exposeDrawer();

    } else {

        this.hideDrawer();
    }
};

/**
 * finish drawer open animation
 */
Gui.Window.Controller.Drawer.prototype.exposeDrawer = function () {

    this.isDispatched = true;
    if (0 === this.nextPos) {
        this.addNodeObserver()
            .resetTransition()
            .triggerStateChanged();
    } else {
        this.view.node.one(this.transitionEndEvents, this.addNodeObserver.bind(this));
        this.view.node.one(this.transitionEndEvents, this.resetTransition.bind(this));
    }
    document.body.classList.add('show');
    this.resetTransform();
    this.hasTouchEndObserver = false;
};

/**
 * reset transform styles
 * @returns {Gui.Window.Controller.Drawer}
 */
Gui.Window.Controller.Drawer.prototype.resetTransform = function () {
    this.view.node[0].style[this.vendor.jsStyle] = '';
    this.view.modalOverlay[0].style.background = '';
    this.indicator[0].style.width = '';
    return this;
};

/**
 * reset transition styles
 * @returns {Gui.Window.Controller.Drawer}
 */
Gui.Window.Controller.Drawer.prototype.resetTransition = function () {
    this.view.node[0].style.transition = '';
    this.view.modalOverlay[0].style.transition = '';
    this.indicator[0].style.transition = '';
    return this;
};

/**
 * remove classes necessary to show drawer
 * @returns {Gui.Window.Controller.Drawer}
 */
Gui.Window.Controller.Drawer.prototype.removeShowClasses = function () {
    document.body.classList.remove('pull');
    document.body.classList.remove('show');
    return this;
};

/**
 * add touch observer to node
 * @returns {Gui.Window.Controller.Drawer}
 */
Gui.Window.Controller.Drawer.prototype.addNodeObserver = function () {

    this.view.node.on('touchmove.drawer', this.touchMove.bind(this));
    return this;
};

/**
 * hide drawer
 */
Gui.Window.Controller.Drawer.prototype.hideDrawer = function () {

    this.view.node.off(this.transitionEndEvents);
    this.removeShowClasses();
    if (this.nextPos < 260) {
        this.view.node.one(this.transitionEndEvents, this.finishHideDrawer.bind(this));
        setTimeout(this.resetTransform.bind(this), 20);
    } else {
        this.resetTransform()
            .finishHideDrawer();
    }
};

/**
 * finish drawer
 */
Gui.Window.Controller.Drawer.prototype.finishHideDrawer = function () {

    this.resetTransition();
    this.isDispatched = false;
    this.destructCallback();
    this.cancelTriggerAnimation = true;
    history.back();
};

/**
 * retrieve max width of drawer
 * @returns {Number}
 */
Gui.Window.Controller.Drawer.prototype.getMaxWidth = function () {

    if (!this.maxWidth) {
        this.maxWidth = parseInt(window.getComputedStyle(this.view.node[0]).getPropertyValue('max-width'), 10);
    }

    return this.maxWidth;
};

/**
 * retrieve remain transition duration
 * @returns {number}
 */
Gui.Window.Controller.Drawer.prototype.getRemainDuration = function () {

    var deltaT = (Date.now() - this.data.startTime) / 1000,
        deltaTouch = Math.abs(this.data.touchstart - this.touchend),
        speed = deltaTouch / deltaT,
        deltaToEnd = this.getMaxWidth() - deltaTouch,
        remainTime = deltaToEnd / speed;

    return remainTime > 1 ? 1 : remainTime;
};

/**
 * button provides data-module attribute
 * containing module name to be dispatched
 * close drawer only if not found
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.Drawer.prototype.handleStateChanged = function (e) {

    var request = $(this).attr('data-module');

    VDRest.Abstract.Controller.prototype.vibrate();

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

    document.body.classList.remove('hide');
    this.removeShowClasses();

    document.body.classList.remove('drawer');
    this.nextPos = -this.getMaxWidth();

    $.event.trigger({
        "type" : "drawer.statechanged",
        "payload" : false
    });
};

/**
 * handle favourite click
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.Drawer.prototype.handleFavClick = function (e) {

    var source, dest, delta,
        epg = VDRest.app.getModule('Gui.Epg'),
        wrapperTop = epg.getView('Broadcasts').wrapper.offset().top,
        channelId = $(e.currentTarget).attr('data-channelId'),
        channel = epg.getView('Channels.Channel', channelId).node,
        slider = epg.getController('Broadcasts').touchScroll.slider,
        sliderState = slider.getState();

    e.preventDefault();
    e.stopPropagation();

    if ("undefined" === typeof this.preventClick) {

        if ("undefined" !== typeof this.channelClickTimeout) {
            window.clearTimeout(this.channelClickTimeout);
        }

        source = Math.abs(sliderState.y);
        dest = Math.abs(epg.getView('Broadcasts.List', channelId).node.offset().top - sliderState.y);

        delta = {
            "x": 0,
            "y": source - dest + wrapperTop
        };

        slider.translate(delta);

        this.handleStateChanged(e);

        channel.addClass('attention');

        setTimeout(function () {
            channel.removeClass('attention');
        }, 3000);
    }
};

/**
 * handle favourite mouse down
 */
Gui.Window.Controller.Drawer.prototype.handleFavDown = function (e) {

    this.preventClick = undefined;
    this.vibrate();

    if (VDRest.info.getStreamer()) {
        this.channelClickTimeout = window.setTimeout(function () {

            this.view.node.one(this.transitionEndEvents, this.playFavourite.bind(this, e));
            this.vibrate(100);
            this.preventClick = true;
            this.handleStateChanged(e);

        }.bind(this), 500);
    }
};

/**
 * request favourite video player
 * @param {jQuery.Event} e
 */
Gui.Window.Controller.Drawer.prototype.playFavourite = function (e) {

    Gui.Epg.Controller.Channels.Channel.prototype.startStream(
        VDRest.app.getModule('VDRest.Epg').getModel(
            'Channels.Channel',
            $(e.currentTarget).attr('data-channelId')
        )
    );

};

/**
 * DESTROY!
 */
Gui.Window.Controller.Drawer.prototype.destructView = function () {

    if (!this.cancelTriggerAnimation) {
        this.triggerAnimation();
    } else {
        this.cancelTriggerAnimation = undefined;
    }
};
