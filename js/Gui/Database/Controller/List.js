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

    this.defaultSorting = VDRest.config.getItem('databaseDefaultSorting');
    this.currentSorting =
        VDRest.config.getItem('currentDatabaseSorting') ||
        this.defaultSorting;
};

/**
 * dispatch view
 * @param {Gui.Window.Controller.DatabaseList} parent
 */
Gui.Database.Controller.List.prototype.dispatchView = function (parent) {

    this.window = parent;

    this.view.setParentView({
        "node": parent.view.body
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

    if (VDRest.helper.isTouchDevice) {
        this.view.ctrlSearch
            .on('touchend', this.handleUp.bind(this, this.search.bind(this)))
            .on('touchstart', this.handleDown.bind(this, this.resetSearch.bind(this)))
        ;
        this.view.ctrlSort
            .on('touchend', this.handleUp.bind(this, this.handleSort.bind(this)))
            .on('touchstart', this.handleDown.bind(
                this,
                this.sort.bind(
                    this,
                    this.currentSorting.replace(/(Asc|Desc)$/, ''),
                    this.currentSorting.indexOf('Desc') > -1
                )
            ))
        ;
    } else {
        this.view.ctrlSearch
            .on('mouseup', this.handleUp.bind(this, this.search.bind(this)))
            .on('mousedown', this.handleDown.bind(this, this.resetSearch.bind(this)))
        ;
        this.view.ctrlSort
            .on('mouseup', this.handleUp.bind(this, this.handleSort.bind(this)))
            .on('mousedown', this.handleDown.bind(
                this,
                this.sort.bind(
                    this,
                    this.currentSorting.replace(/(Asc|Desc)$/, ''),
                    this.currentSorting.indexOf('Desc') > -1
                )
            ))
        ;
    }
};

/**
 * remove event listeners
 */
Gui.Database.Controller.List.prototype.removeObserver = function () {

    document.removeEventListener(this.transitionEndEvent, this.handleTransitionEnd.bind(this));
    this.view.ctrlSearch.off('touchend touchstart mouseup mousedown mousemove touchmove');
    this.view.ctrlSort.off('touchend touchstart mouseup mousedown mousemove touchmove');
};

/**
 * dispatch item
 * @param {VDRest.Database.Model.Item} item
 */
Gui.Database.Controller.List.prototype.dispatchItem = function (item) {

    var sing = this.id.replace(/s$/, '');

    this.module.getController(
        'List.' + sing,
        {"parent": this, "media": item, "type": sing, "index": this.tiles.length}
    ).dispatchView();
    this.tiles.push(this.view.node[0].lastChild);
    this.view.setWidth(parseInt(this.view.node[0].style.width, 10) + this.sliderTileWidth);

    if (!this.scrollerReady && this.tiles.length * this.sliderTileWidth > window.innerWidth) {
        this.applyScroller();
    }
};

/**
 * handle mouseup
 */
Gui.Database.Controller.List.prototype.handleUp = function (callback, e) {

    e.preventDefault();

    if (!this.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            this.vibrate();

            if ("undefined" !== typeof this.clickTimeout) {
                window.clearTimeout(this.clickTimeout);
            }

            callback()
        }
    }
    document.onselectstart = function () {
        return true
    };
};

/**
 * handle mousedown
 */
Gui.Database.Controller.List.prototype.handleDown = function (callback) {

    document.onselectstart = function () {
        return false
    };

    this.preventClick = undefined;
    if (VDRest.info.getStreamer()) {

        this.clickTimeout = window.setTimeout(function () {

            this.vibrate(100);

            this.preventClick = true;

            callback();
        }.bind(this), 500);
    }
};

/**
 * handle sort request
 */
Gui.Database.Controller.List.prototype.handleSort = function () {

    this.sortForm.submit = function (fields) {

        var method = fields.method.getValue().method,
            reverse = fields.reverse.getValue();
        if (method) {
            this.sort(method, reverse);
        }
    }.bind(this);

    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "Window.Form",
            "module": VDRest.app.getModule('Gui.Form'),
            "data": {
                "form": this.sortForm
            }
        }
    });
};

/**
 * sort by method
 * @param {String} method
 * @param {Boolean} reverse
 */
Gui.Database.Controller.List.prototype.sort = function (method, reverse) {

    var collection = this.currentCollection ? this.currentCollection : this.collection;

    reverse = !!reverse;

    collection.sort(collection[method].bind(collection), reverse, function () {
        this.resetContextMenuSortStates();
        VDRest.app.getCurrent(true).contextMenu[method].state = reverse ? 'on' : 'off';
        this.currentSorting = method + (reverse ? 'Desc' : 'Asc');
        VDRest.config.setItem('currentDatabaseSorting', this.currentSorting);
        if (this.tiles.length > 0) {
            this.currentActive = 0;
            this.currentPrevious = 1;
            this.resetHighlightImages();
        }
        this.tiles = [];
        this.view.node.empty();
        this.view.setWidth(0);
        collection.each(this.dispatchItem.bind(this), function () {
            this.scroller.tiles.tiles = this.view.node.get(0).querySelectorAll('div.list-item');
            this.scroller.slider.translate({"x": this.scroller.slider.getState().x * -1, "y": 0});
        }.bind(this));
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

    this.searchForm.submit = function (fields) {

        this.collection.search(this.parseSearchRequest(fields), function () {
            this.currentCollection = this.collection.searchResult;
            this.filterItems();
        }.bind(this));
    }.bind(this);

    this.searchForm.fields.attributes.values.title.value = this.collection.nameAttribute;

    this.searchForm.fields.genre.values = this.getGenres.bind(this);

    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "Window.Form",
            "module": VDRest.app.getModule('Gui.Form'),
            "data": {
                "form": this.searchForm
            }
        }
    });
};

/**
 * parse form fields
 * @param {{}} fields
 * @returns {{}}
 */
Gui.Database.Controller.List.prototype.parseSearchRequest = function (fields) {

    var request = {
        "genre": [],
        "attributes": [],
        "query": fields.query.getValue()
    }, genre;

    if (!fields.attributes.disabled) {
        request.attributes = fields.attributes.getValue().map(function (attribute) {
            return attribute.value;
        });
    }

    genre = fields.genre.getValue();

    if (genre instanceof Array) {

        genre = genre.map(function (genre) {
            return genre.value;
        });
        request.genre = genre;
    }

    return request;
};

/**
 * retrieve genres as values for multi select
 */
Gui.Database.Controller.List.prototype.getGenres = function () {

    var values = {}, gNormReg = new RegExp('[^a-z]', 'g');
    this.collection.getGenres().forEach(function (genre) {
        var gNorm = genre.toLowerCase().replace(gNormReg, '-');
        values[gNorm] = {
            "label": genre,
            "value": genre
        };
    }.bind(this));

    return values;
};

/**
 * reset items list
 */
Gui.Database.Controller.List.prototype.resetSearch = function () {

    this.currentCollection = undefined;
    this.filterItems();
};

/**
 * filter items list
 */
Gui.Database.Controller.List.prototype.filterItems = function () {

    var collection = this.currentCollection ? this.currentCollection : this.collection;

    if (this.tiles.length > 0) {
        this.currentActive = 0;
        this.currentPrevious = 1;
        this.resetHighlightImages();
    }
    this.tiles = [];
    this.view.node.empty();
    this.view.setWidth(0);
    if (collection.getCollection().length > 0) {
        collection.each(this.dispatchItem.bind(this), function () {
            this.scroller.tiles.tiles = this.view.node.get(0).querySelectorAll('div.list-item');
            this.scroller.slider.translate({"x": this.scroller.slider.getState().x * -1, "y": 0});
        }.bind(this));
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
 * hide scroller
 */
Gui.Database.Controller.List.prototype.hideListView = function () {

    this.view.window.classList.add('hidden');
};

/**
 * reveal scroller
 */
Gui.Database.Controller.List.prototype.showListView = function () {

    this.view.window.classList.remove('hidden');
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
