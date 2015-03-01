/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List.Item = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.Item.prototype = new VDRest.Abstract.Controller();

/**
 * @type {boolean}
 */
Gui.Database.Controller.List.Item.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Database.Controller.List.Item.prototype.init = function () {

    this.view = this.module.getView('List.' + this.data.type, this.data);

    this.view.setParentView(this.data.parent.view);

    this.hiddenInfo = true;
};

/**
 * dispatch view
 */
Gui.Database.Controller.List.Item.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Database.Controller.List.Item.prototype.addObserver = function () {

    this.view.node.on('click', this.handleClick.bind(this));
};

/**
 * remove event listeners
 */
Gui.Database.Controller.List.Item.prototype.removeObserver = function () {

    this.view.node.off('click');
};

/**
 * add observers to clone
 */
Gui.Database.Controller.List.Item.prototype.addCloneObserver = function () {
    this.clone.find('.ctrl-button.info').on('click', this.handleInfo.bind(this));
    this.clone.find('.ctrl-button.play').on('click', this.handlePlay.bind(this));
};

/**
 * remove observers from clone
 */
Gui.Database.Controller.List.Item.prototype.removeCloneObserver = function () {
    this.clone.find('.ctrl-button.info').off('click');
    this.clone.find('.ctrl-button.play').off('click');
};

/**
 * handle click event
 */
Gui.Database.Controller.List.Item.prototype.handleClick = function () {

    this.vibrate();

    VDRest.app.saveHistoryState('hashChanged', this.removeItem.bind(this), 'DatabaseList~DisplayItem');
    this.displayItem();
};

/**
 * handle info event
 */
Gui.Database.Controller.List.Item.prototype.handleInfo = function () {

    this.vibrate();

    if (this.hiddenInfo) {
        this.showInfo();
    } else {
        this.hideInfo();
    }
    this.hiddenInfo = !this.hiddenInfo;
};

/**
 * reveal info area
 */
Gui.Database.Controller.List.Item.prototype.showInfo = function () {

    this.clone.one(this.transitionEndEvent, function () {
        this.clone.toggleClass('hidden-info-area', false);
    }.bind(this));

    this.clone.toggleClass('hidden-overview', true);
};

/**
 * hide info area
 */
Gui.Database.Controller.List.Item.prototype.hideInfo = function () {

    this.clone.one(this.transitionEndEvent, function () {
        this.clone.toggleClass('hidden-overview', false);
    }.bind(this));

    this.clone.toggleClass('hidden-info-area', true);
};

/**
 * handle play event
 */
Gui.Database.Controller.List.Item.prototype.handlePlay = function () {

    var number = this.data.media.data.recording_number;

    this.vibrate();

    VDRest.app.getModule('VDRest.Recordings').loadModel('List.Recording', number, function (recording) {

        this.startStream(recording);
    }.bind(this))
};

/**
 * start streaming
 */
Gui.Database.Controller.List.Item.prototype.startStream = function (recording) {

    if (VDRest.info.canUseHtmlPlayer() && VDRest.info.canRemuxRecordings()) {

        $.event.trigger({
            "type": "window.request",
            "payload": {
                "type": "VideoPlayer",
                "data": {
                    "sourceModel": recording
                }
            }
        });
    } else {
        window.location.href = recording.getStreamUrl();
    }
};

/**
 * toggle display of single item on
 * @returns {Gui.Database.Controller.List.Item}
 */
Gui.Database.Controller.List.Item.prototype.displayItem = function () {

    var typeClassName = this.data.type.toLowerCase() + 's',
        parent = this.getData('parent'),
        index = this.getData('index'),
        delta = {
            "x": ((parent.currentActive - 1) - index) * parent.scroller.tiles.getTileWidth(),
            "y": 0
        },
        hideScroller = function () {
            this.addScrollerHiddenEvent();
            parent.hideScroller();
        }.bind(this);

    this.clone = this.view.node.clone();
    this.clone.find('.poster').css({"transform": ""});

    this.clone.toggleClass('database-collection display-item hidden list-item ' + typeClassName);


    if (delta.x != 0) {
        $(parent.scroller.slider.elem).one(this.transitionEndEvent, function () {
            setTimeout(function () {
                hideScroller();
            }.bind(this), 20);
        }.bind(this));

        parent.scroller.slider.translate(delta);
    } else {
        hideScroller();
    }

    return this;
};

/**
 * add event scroller hidden animation is ready
 */
Gui.Database.Controller.List.Item.prototype.addScrollerHiddenEvent = function () {

    this.getData('parent').window.view.body.one(this.transitionEndEvent, function () {
        this.addClone();
    }.bind(this));
};

/**
 * add clone to body
 */
Gui.Database.Controller.List.Item.prototype.addClone = function () {

    this.clone.appendTo('body');
    setTimeout(function () {
        this.clone.toggleClass('hidden show');
        this.addCloneObserver();
    }.bind(this), 20);
};

/**
 * toggle display of single item off
 * @returns {Gui.Database.Controller.List.Item}
 */
Gui.Database.Controller.List.Item.prototype.removeItem = function () {

    this.hiddenInfo = true;
    this.removeCloneObserver();
    this.clone.toggleClass('hidden show');
    this.clone.toggleClass('hidden-info-area', true);
    this.clone.one(this.transitionEndEvent, function () {
        this.clone.remove();
        this.clone = undefined;
        this.getData('parent').showScroller();
    }.bind(this));

    return this;
};