Gui.Window.Controller.ScrollAnimateHeader = function () {
};

Gui.Window.Controller.ScrollAnimateHeader.prototype = new Gui.Window.Controller.Abstract();

/**
 * initialize
 */
Gui.Window.Controller.ScrollAnimateHeader.prototype.init = function () {

    Gui.Window.Controller.Abstract.prototype.init.call(this);

    this.menubar = VDRest.app.getModule('Gui.Menubar').getView('Default').node[0];
    this.menubarHidden = true;
};


Gui.Window.Controller.ScrollAnimateHeader.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    if (this.view.fanart) {
        $.event.trigger({
            "type": "opaqueMenubar",
            "payload": true
        });
    }

    if (this.view.canAnimateScroll()) {

        this.touchScroll = new TouchMove.Scroll({
            "wrapper": document.body,
            "onmove": this.onscrollAction.bind(this),
            "allowedDirections": ['y'],
            "sliderClassName": "scroll-animate-header"
        });
        document.body.style.overflow = 'hidden';
    }
};

/**
 * add event listeners
 */
Gui.Window.Controller.ScrollAnimateHeader.prototype.addObserver = function () {

    if (this.view.fanart && !VDRest.helper.touchMoveCapable) {
        this.scrollHandler = this.onscrollAction.bind(this);
        this.view.node.on('scroll', this.scrollHandler);
    }

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};

/**
 * remove event listeners
 */
Gui.Window.Controller.ScrollAnimateHeader.prototype.removeObserver = function () {

    if (this.view.fanart && !VDRest.helper.isTouchDevice) {
        this.view.node.off('scroll', this.scrollHandler);
    }

    Gui.Window.Controller.Abstract.prototype.removeObserver.call(this);
};

/**
 * shift header contents on scroll
 * @param {{x:number,y:number}|jQuery.Event} e
 */
Gui.Window.Controller.ScrollAnimateHeader.prototype.onscrollAction = function (e) {

    var delta, style, n;

    if (e instanceof jQuery.Event) {
        delta = this.view.node[0].scrollTop;
    } else {
        delta = -e.y;
    }

    style = "translateY(" + (delta / 2).toString() + "px)";

    this.view.scrollShiftWrapper.css({
        "transform": style
    });

    if (this.view.fanart) {

        n = this.view.header[0].offsetHeight - delta;

        if (n < this.menubar.offsetHeight && this.menubarHidden) {

            $.event.trigger({
                "type": "opaqueMenubar",
                "payload": false
            });
            this.menubarHidden = false;

        } else if (n >= this.menubar.offsetHeight && !this.menubarHidden) {

            $.event.trigger({
                "type": "opaqueMenubar",
                "payload": true
            });
            this.menubarHidden = true;
        }
    }
};

/**
 * Destroy
 */
Gui.Window.Controller.ScrollAnimateHeader.prototype.destructView = function () {

    $.event.trigger({
        "type": "opaqueMenubar",
        "payload": false
    });
    delete this.touchScroll;
    document.body.style.overflow = '';

    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
};