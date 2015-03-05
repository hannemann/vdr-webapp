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

    this.data.areas = ['overview'];

    this.view = this.module.getView('List.' + this.data.type, this.data);

    this.view.setParentView(this.data.parent.view);
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
    this.clone.find('.ctrl-button.info').on('click', this.handleArea.bind(this, 'info'));
    this.clone.find('.ctrl-button.actors').on('click', this.handleArea.bind(this, 'actors'));
};

/**
 * remove observers from clone
 */
Gui.Database.Controller.List.Item.prototype.removeCloneObserver = function () {
    this.clone.find('.ctrl-button').off('click');
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
        hideListView = function () {
            this.addScrollerHiddenEvent();
            parent.hideListView();
        }.bind(this);

    this.clone = this.view.node.clone();
    this.clone.find('.poster').css({"transform": ""});

    this.clone.toggleClass('database-collection display-item hidden list-item ' + typeClassName);

    if ('portrait' === VDRest.helper.getOrientation()) {
        this.addClone();
        this.addActors();
        if (delta.x != 0) {
            if (!parent.tmpDelta) parent.tmpDelta = 0;
            parent.tmpDelta += delta.x;
        }
    } else {

        if (delta.x != 0) {
            $(parent.scroller.slider.elem).one(this.transitionEndEvent, function () {
                setTimeout(function () {
                    hideListView();
                }.bind(this), 20);
            }.bind(this));

            parent.scroller.slider.translate(delta);
        } else {
            hideListView();
        }
    }
    this.data.parent.activeItem = this;

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
 * handle info event
 * @param {String} area
 * @param {jQuery.Event} e
 */
Gui.Database.Controller.List.Item.prototype.handleArea = function (area, e) {

    if ($(e.target).hasClass('disabled')) return;

    this.vibrate();

    if ('actors' === area && !this.actors) {
        this.addActors();
    }

    if (this.clone.hasClass('hidden-' + area)) {
        this.showArea(area);
    } else {
        this.showOverview();
    }
};

/**
 * reveal area
 * @param {String} area
 */
Gui.Database.Controller.List.Item.prototype.showArea = function (area) {

    this.clone.one(this.transitionEndEvent, function () {
        this.clone.toggleClass('hidden-' + area, false);
    }.bind(this));

    this.hideAll();
};

/**
 * reveal overview
 */
Gui.Database.Controller.List.Item.prototype.showOverview = function () {

    this.clone.one(this.transitionEndEvent, function () {
        this.clone.toggleClass('hidden-overview', false);
    }.bind(this));

    this.hideAll();
};

/**
 * hide everything
 */
Gui.Database.Controller.List.Item.prototype.hideAll = function () {

    this.clone.toggleClass(this.getHiddenClassList(), true);
};

/**
 * retrieve class list needed to hide everything
 */
Gui.Database.Controller.List.Item.prototype.getHiddenClassList = function () {

    return this.data.areas.map(function (area) {
        return 'hidden-' + area;
    }).join(' ');
};

/**
 * add actors
 */
Gui.Database.Controller.List.Item.prototype.addActors = function () {

    this.actors = this.module.getController('List.Item.Actors', {
        "media": this.getData('media').getData(),
        "parent": {
            "view": {
                "node": this.clone
            }
        }
    });

    this.clone.addClass('hidden-actors');
    this.data.areas.push('actors');
    this.actors.dispatchView();
};

/**
 * toggle display of single item off
 * @returns {Gui.Database.Controller.List.Item}
 */
Gui.Database.Controller.List.Item.prototype.removeItem = function () {

    this.removeCloneObserver();
    this.actors && this.actors.destructView();
    this.clone.one(this.transitionEndEvent, function () {
        this.clone.remove();
        this.clone = undefined;
        this.actors = undefined;
        delete this.data.parent.activeItem;
        this.getData('parent').showListView();
    }.bind(this));
    this.clone.toggleClass('hidden show');

    return this;
};
