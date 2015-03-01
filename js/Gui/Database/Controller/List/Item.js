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
};

/**
 * dispatch view
 */
Gui.Database.Controller.List.Item.prototype.dispatchView = function () {

    //this.helper().log(this.data);

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
        };

    this.clone = this.view.node.clone();
    this.clone.find('.poster').css({"transform": ""});

    this.clone.toggleClass('database-collection display-item hidden list-item ' + typeClassName);


    if (delta.x != 0) {
        $(parent.scroller.slider.elem).one(this.transitionEndEvent, function () {
            setTimeout(function () {
                this.addScrollerHiddenEvent();
                parent.hideScroller();
            }.bind(this), 20);
        }.bind(this));

        parent.scroller.slider.translate(delta);
    } else {
        this.addScrollerHiddenEvent();
        parent.hideScroller();
    }

    return this;
};

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
    }.bind(this), 20);
};

/**
 * toggle display of single item off
 * @returns {Gui.Database.Controller.List.Item}
 */
Gui.Database.Controller.List.Item.prototype.removeItem = function () {

    this.clone.toggleClass('hidden show');
    this.clone.one(this.transitionEndEvent, function () {
        this.clone.remove();
        this.getData('parent').showScroller();
    }.bind(this));

    return this;
};