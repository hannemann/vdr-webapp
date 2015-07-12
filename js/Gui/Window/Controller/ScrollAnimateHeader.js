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

    var menubarHeader, sliderClassName = "scroll-animate-header";

    if ("undefined" !== typeof this.data.sliderClassName) {
        sliderClassName = this.data.sliderClassName;
    }

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    if (this.view.fanart) {
        $.event.trigger({
            "type": "opaqueMenubar",
            "payload": true
        });
    }

    this.menuBarController = VDRest.app.getModule('Gui.Menubar').getController('Default');

    menubarHeader = $('.menubar-header');
    this.headerHeight = this.view.header[0].offsetHeight;
    this.menuBarHeight = $('#menubar')[0].offsetHeight;
    this.menuHeaderOffset = menubarHeader[0].offsetLeft;
    if (this.view.fanart) {
        this.menuBarController.view.node.addClass('big-font');
    }

    if (this.view.canAnimateScroll()) {

        this.touchScroll = new TouchMove.Scroll({
            "wrapper": document.body,
            "onmove": this.onscrollAction.bind(this),
            "allowedDirections": ['y'],
            "sliderClassName": sliderClassName
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

    var delta, style, shadowStyle, titleStyle, n, deltaPercentage, headerOffsetLeft;

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


        deltaPercentage = 100 / (this.headerHeight - this.menuBarHeight) * Math.abs(delta);
        deltaPercentage = deltaPercentage > 100 ? 100 : deltaPercentage;
        headerOffsetLeft = Math.round((this.menuHeaderOffset - 8) * deltaPercentage / 100);


        shadowStyle = "translateY(-" + (delta / 2).toString() + "px)";

        this.view.scrollShiftShadow.css({
            "transform": shadowStyle
        });

        if (this.headerHeight - delta > this.menuBarHeight) {
            titleStyle = {
                "transform": "translate3d(" + headerOffsetLeft + "px, -" + (delta / 2).toString() + "px, 0)"
            };
        } else {
            titleStyle = {
                "transform": "translate3d(" + headerOffsetLeft + "px, -" + (delta / 2 - (this.menuBarHeight - (this.headerHeight - delta))).toString() + "px, 0)"
            };
        }

        this.view.title.css(titleStyle);

        n = this.view.header[0].offsetHeight - delta;

        if (n < this.menubar.offsetHeight && this.menubarHidden) {

            this.menuBarController.setOpaque({"payload" : false});
            this.menubarHidden = false;

        } else if (n >= this.menubar.offsetHeight && !this.menubarHidden) {

            this.menuBarController.setOpaque({"payload" : true});
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
    this.menuBarController.view.node.removeClass('big-font');
    delete this.menuBarController;

    Gui.Window.Controller.Abstract.prototype.destructView.call(this);
};