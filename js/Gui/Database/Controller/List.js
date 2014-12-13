/**
 * @class
 * @constructor
 */
Gui.Database.Controller.List = function () {
};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.List.prototype = new VDRest.Abstract.Controller();

/**
 * bypass caching mechanism
 */
Gui.Database.Controller.List.prototype.bypassCache = true;

/**
 * retrieve collection model
 * @param {String} type
 */
Gui.Database.Controller.List.prototype.getCollection = function (type) {

    this.collection = this.module.backend.getModel(type);
    this.view.data.collection = this.collection;
};

/**
 * init view
 */
Gui.Database.Controller.List.prototype.init = function () {

    this.view = this.module.getView(this.id);

    this.sliderTileWidth = 65;
    this.tiles = [];

    this.getCollection(this.id);
};

/**
 * dispatch view
 * @param {Gui.Window.View.Abstract} parentView
 */
Gui.Database.Controller.List.prototype.dispatchView = function (parentView) {

    this.view.setParentView({
        "node": parentView.body
    });

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();

    this.view.node[0].style.width = '0px';

    this.collection.each(this.dispatchItem.bind(this));
};

Gui.Database.Controller.List.prototype.addObserver = function () {

    document.addEventListener(this.transitionEndEvent, this.handleTransitionEnd.bind(this));
};

Gui.Database.Controller.List.prototype.removeObserver = function () {

    document.removeEventListener(this.transitionEndEvent, this.handleTransitionEnd);
};

/**
 * dispatch item
 * @param {VDRest.Database.Model.Item} item
 */
Gui.Database.Controller.List.prototype.dispatchItem = function (item) {

    var sing = this.id.replace(/s$/, '');

    this.module.getController(
        'List.' + sing,
        {"parent": this, "media": item, "type": sing}
    ).dispatchView();
    this.tiles.push(this.view.node[0].lastChild);
    this.view.node[0].style.width = parseInt(this.view.node[0].style.width, 10) + this.sliderTileWidth + 'px';

    if (!this.scrollerReady && this.tiles.length * this.sliderTileWidth > window.innerWidth) {
        this.applyScroller();
    }
};

/**
 * apply scroller to item list
 */
Gui.Database.Controller.List.prototype.applyScroller = function () {

    var active = 0;
    this.startActive = active * this.sliderTileWidth;
    this.highlightPosZ = 350;
    this.viewport = this.view.node[0].parentNode.parentNode;

    this.applyHighlight(active, this.highlightPosZ, 1, 'active');

    this.addTitle(active).addFanart(active);

    this.currentActive = 0;
    this.currentPrevious = 1;

    this.slider = new TouchMove.Scroll({
        "wrapper" : this.view.node[0].parentNode,
        "sliderClassName" : "database-collection-slider",
        "allowedDirections" : ["x"],
        "allowedOrientations" : ["landscape"],
        "grid" : {"x" : this.sliderTileWidth},
        "onmove" : this.highlightActive.bind(this)
    });

    this.scrollerReady = true;
};

/**
 * highlight current active tiles
 * @param {{x: Number, y: Number}} pos
 */
Gui.Database.Controller.List.prototype.highlightActive = function (pos) {

    var dist = Math.abs((Math.round(pos.x) - this.startActive) / this.sliderTileWidth),
        active = Math.floor(dist),
        distP = Math.round((dist-active)*100),
        previousP = Math.round((this.highlightPosZ/100) * (100-distP)),
        nextP = Math.round((this.highlightPosZ/100) * distP);

    if (active > this.tiles.length - 1) return;

    requestAnimationFrame(function () {

        this.resetHighlightImages();

        this.applyHighlight(active, previousP, distP > 50 ? 0 : 1, 'previous');

        if (active + 1 < this.tiles.length) {

            this.applyHighlight(active + 1, nextP, distP > 50 ? 1 : 0, 'active')
        }

        this.currentPrevious = active;
        this.currentActive = active + 1;

        if (distP === 0) {

            if ("undefined" !== typeof this.fanartTimeout) {
                clearTimeout(this.fanartTimeout);
                this.fanartTimeout = undefined;
            }

            this.fanartTimeout = setTimeout(this.handleScrollerSnap.bind(this, active), 50);
        }
    }.bind(this));
};

/**
 * reset states of highlighted images in scroller
 * @returns {Gui.Database.Controller.List}
 */
Gui.Database.Controller.List.prototype.resetHighlightImages = function () {

    this.removeHighlight(this.currentActive)
        .removeHighlight(this.currentPrevious);

    return this;
};

/**
 * remove highlight styles from specific element in scroller
 * @param index
 * @returns {Gui.Database.Controller.List}
 */
Gui.Database.Controller.List.prototype.removeHighlight = function (index) {

    var img = this.tiles[index].querySelector('img.poster'),
        classList = this.tiles[index].classList;

    if (img) img.style.transform = '';
    this.tiles[index].style.zIndex = 0;
    classList.remove('previous', 'active');

    return this;
};

/**
 * apply highlight styles to specific element in scroller
 * @param {Number} index
 * @param {Number} zPos
 * @param {Number} zIndex
 * @param {String} className
 * @returns {Gui.Database.Controller.List}
 */
Gui.Database.Controller.List.prototype.applyHighlight = function (index, zPos, zIndex, className) {

    var img = this.tiles[index].querySelector('img.poster'),
        classList = this.tiles[index].classList;

    if (img) img.style.transform = 'translateZ(' + zPos + 'px)';
    this.tiles[index].style.zIndex = zIndex;
    classList.add(className);

    return this;
};

/**
 * handle scroller reached snap position
 */
Gui.Database.Controller.List.prototype.handleScrollerSnap = function (active) {

    this.removeTransparentItems();

    this.toggleTitle(active)
        .toggleFanart(active);

    Array.prototype.forEach.call(this.tiles, function (tile, index) {
        this.removeHighlight(arguments[1]);
    }.bind(this));

    if (active + 1 < this.tiles.length) {
        this.removeHighlight(active + 1);
    }
    this.tiles[active].classList.remove('previous');
    this.applyHighlight(active, this.highlightPosZ, 1, 'active');
};

/**
 * remove all found transparent item in extra task
 * to avoid timing problems
 */
Gui.Database.Controller.List.prototype.removeTransparentItems = function () {

    Array.prototype.forEach.call(this.viewport.querySelectorAll('.transparent'), function (elem) {
        elem.parentNode.removeChild(elem);
    });
};

/**
 * toggle title
 * @param {Number} active
 * @returns {Gui.Database.Controller.List}
 */
Gui.Database.Controller.List.prototype.toggleTitle = function (active) {

    this.currentTitle.classList.add('transparent');
    this.oldTitle = this.currentTitle;

    return this.addTitle(active);
};

/**
 * add title
 * @param {Number} active
 * @returns {Gui.Database.Controller.List}
 */
Gui.Database.Controller.List.prototype.addTitle = function (active) {

    this.currentTitle = this.tiles[active].querySelector('div.title').cloneNode(true);
    this.viewport.insertBefore(this.currentTitle, this.viewport.firstChild);

    return this;
};

/**
 * toggle fanart
 * @param {Number} active
 * @returns {Gui.Database.Controller.List}
 */
Gui.Database.Controller.List.prototype.toggleFanart = function (active) {

    if (this.currentFanart) {
        this.currentFanart.classList.add('transparent');
        this.oldFanart = this.currentFanart;
    }

    return this.addFanart(active);
};

/**
 * add fanart
 * @param {Number} active
 * @returns {Gui.Database.Controller.List}
 */
Gui.Database.Controller.List.prototype.addFanart = function (active) {

    this.currentFanart = this.tiles[active].querySelector('img.fanart');
    if (this.currentFanart) {
        this.currentFanart = this.currentFanart.cloneNode(false);
        this.viewport.insertBefore(this.currentFanart, this.viewport.firstChild);
    }

    return this;
};

/**
 * handle transition ended
 * @param {TransitionEvent} e
 */
Gui.Database.Controller.List.prototype.handleTransitionEnd = function (e) {

    if (e.target === this.oldTitle) {
        this.oldTitle.parentNode.removeChild(this.oldTitle);
        this.oldTitle = null;
    }
    if (e.target === this.oldFanart) {
        this.oldFanart.parentNode.removeChild(this.oldFanart);
        this.oldFanart = null;
    }
};
