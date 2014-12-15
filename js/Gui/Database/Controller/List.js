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

    this.module.currentList = this;

    this.currentSorting = VDRest.config.getItem('databaseDefaultSorting');
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

    this.sort(
        this.currentSorting.replace(/(Asc|Desc)$/, ''),
        this.currentSorting.indexOf('Desc') > -1
    );
};

/**
 * add event listeners
 */
Gui.Database.Controller.List.prototype.addObserver = function () {

    document.addEventListener(this.transitionEndEvent, this.handleTransitionEnd.bind(this));
};

/**
 * remove event listeners
 */
Gui.Database.Controller.List.prototype.removeObserver = function () {

    document.removeEventListener(this.transitionEndEvent, this.handleTransitionEnd.bind(this));
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
    this.view.setWidth(parseInt(this.view.node[0].style.width, 10) + this.sliderTileWidth);

    if (!this.scrollerReady && this.tiles.length * this.sliderTileWidth > window.innerWidth) {
        this.applyScroller();
    }
};

/**
 * sort by method
 * @param {String} method
 * @param {Boolean} reverse
 */
Gui.Database.Controller.List.prototype.sort = function (method, reverse) {

    reverse = !!reverse;

    this.collection.sort(this.collection[method], reverse, function () {
        this.resetContextMenuSortStates();
        VDRest.app.getCurrent(true).contextMenu[method].state = reverse ? 'on' : 'off';
        this.currentSorting = method + (reverse ? 'Desc' : 'Asc');
        VDRest.config.setItem('databaseDefaultSorting', this.currentSorting);
        if (this.tiles.length > 0) {
            this.currentActive = 0;
            this.currentPrevious = 1;
            this.resetHighlightImages();
        }
        this.tiles = [];
        this.allTiles = undefined;
        this.view.node.empty();
        this.collection.each(this.dispatchItem.bind(this));
        this.highlightActive(this.scroller.slider.getState());
    }.bind(this));
};

/**
 * reset sorting states in context menu
 */
Gui.Database.Controller.List.prototype.resetContextMenuSortStates = function () {

    var methods = {
        "sortRecordingDate": "off",
        "sortReleaseDate": "off",
        "sortAlpha": "on",
        "sortRating": "off"
    }, contextMenu = VDRest.app.getCurrent(true).contextMenu, i;

    for (i in methods) {
        if (methods.hasOwnProperty(i)) {
            contextMenu[i].state = methods[i];
        }
    }

};

/**
 * create input window for search in title
 */
Gui.Database.Controller.List.prototype.search = function () {

    var data = {
        "type": "string",
        "dom": $('<label class="clearer text">'),
        "showInfo": true
    };

    $('<span>').text(VDRest.app.translate('Search')).appendTo(data.dom);

    data.gui = $('<input type="text" name="search">')
        .appendTo(data.dom);

    data.gui.on('change', function (e) {
        var value = e.target.value;
        this.collection.search(value, function () {
            this.filterItems(this.collection.searchResult);
        }.bind(this));
    }.bind(this));

    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "Input",
            "data": data
        }
    });
};

/**
 * reset items list
 */
Gui.Database.Controller.List.prototype.resetItems = function () {

    this.filterItems('');
    this.view.setWidth(this.allTiles.length * this.sliderTileWidth);
};

/**
 * filter items list
 * items not in ids array will be hidden
 * if empty string is given, all items reappear
 *
 * @param {Array|String} ids       array of ids of items that are not filtered
 */
Gui.Database.Controller.List.prototype.filterItems = function (ids) {

    if (!this.allTiles) {
        this.allTiles = this.tiles;
    }

    this.resetHighlightImages();
    this.currentActive = 0;
    this.currentPrevious = 1;

    this.tiles = [];

    this.allTiles.forEach(function (tile) {
        var id = parseInt(tile.dataset.id, 10);
        if (ids != '' && ids.indexOf(id) < 0) {
            tile.style.display = 'none';
        } else {
            tile.style.display = '';
            this.tiles.push(tile);
        }
    }.bind(this));

    this.view.setWidth(ids.length * this.sliderTileWidth);

    this.highlightActive(this.scroller.slider.getState());
};

/**
 * apply scroller to item list
 */
Gui.Database.Controller.List.prototype.applyScroller = function () {

    var active = 0;
    this.startActive = active * this.sliderTileWidth;
    this.highlightPosZ = 350;
    this.viewport = this.view.node[0].parentNode.parentNode;

    this.view
        .applyHighlight(this.tiles[active], this.highlightPosZ, 1, 'active')
        .addTitle(this.tiles[active])
        .addFanart(this.tiles[active]);

    this.currentActive = 0;
    this.currentPrevious = 1;

    this.scroller = new TouchMove.Scroll({
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

        this.view.applyHighlight(this.tiles[active], previousP, distP > 50 ? 0 : 1, 'previous');

        if (active + 1 < this.tiles.length) {

            this.view.applyHighlight(this.tiles[active + 1], nextP, distP > 50 ? 1 : 0, 'active')
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

    this.view
        .removeHighlight(this.tiles[this.currentActive])
        .removeHighlight(this.tiles[this.currentPrevious]);

    return this;
};

/**
 * handle scroller reached snap position
 */
Gui.Database.Controller.List.prototype.handleScrollerSnap = function (active) {

    this.removeTransparentItems();

    this.view
        .toggleTitle(this.tiles[active])
        .toggleFanart(this.tiles[active]);

    Array.prototype.forEach.call(this.tiles, function (tile, index) {
        this.view.removeHighlight(this.tiles[arguments[1]]);
    }.bind(this));

    if (active + 1 < this.tiles.length) {
        this.view.removeHighlight(this.tiles[active + 1]);
    }
    this.tiles[active].classList.remove('previous');
    this.view.applyHighlight(this.tiles[active], this.highlightPosZ, 1, 'active');
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
 * @typedef {{}} TransitionEvent
 * @property {HTMLElement} target
 */

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

Gui.Database.Controller.List.prototype.destructView = function () {

    this.module.currentList = undefined;
    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
