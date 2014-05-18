/**
 * @class
 * @constructor
 * @method {boolean} hasImages
 * @method {Array} getImages
 */
Gui.Window.View.Broadcast = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Broadcast.prototype = new Gui.Window.View.Abstract();

/**
 * cache key
 * @type {string}
 */
Gui.Window.View.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * @type {string}
 */
Gui.Window.View.Broadcast.prototype.hasHeader = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Broadcast.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Broadcast.prototype.isModalTransparent = true;

/**
 * add components, call render method
 */
Gui.Window.View.Broadcast.prototype.render = function () {

    this.addTitle();

    if (this.hasImages()) {

        this.addMainImage()
    }

    this.addDetails();

    if (this.hasComponents()) {

        this.addComponents()
    }

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.addClasses();

    this.node.toggleClass('collapsed expand');
};

/**
 * add class names
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.addClasses = function () {

    var classNames = ['broadcast'];

    if (this.getTimerExists()) {
        this.handleTimerExists(true);
    }

    if (this.getTimerActive()) {
        this.handleTimerActive(true);
    }

    this.node.addClass(classNames.join(' '));
    return this;
};

/**
 * retrieve tabs configuration
 * @type {Object}
 */
Gui.Window.View.Broadcast.prototype.getTabConfig = function () {

    this.body.addClass('has-tabs');

    var me = this;

    return {
        "keyInCache": this.keyInCache,
        "parentView" : this.body,
        "cacheKey" : this.cacheKey,
        "tabs" : {
            "details": {
                "label": "Details",
                "content": function (content) {

                    $(content).append(me.getDescription());
                },
                "default": true
            },
            "tools": {
                "label": "Tools",
                "content": function (content) {

                $(content).append(me.renderToolsTab());
                }
            },
            "web": {
                "label": "Web",
                "content": function (content) {

                    $(content).append(me.renderWebTab());
                }
            }
        }
    }
};

/**
 * retrieve tools tab configuration
 * @returns {{record: {dom: "dom", callback: "callback"}}}
 */
Gui.Window.View.Broadcast.prototype.getToolsConfig = function () {

    return {
        "record":{
            "dom":function () {

                var dom = $('<dl class="window-button round record-button symbol-button"></dl>');
                this.recordButton = $('<dt>');
                this.recordButtonText = $('<dd>');

                return dom.append(this.recordButton)
                    .append(this.recordButtonText);
            }
        },
        "edit":{
            "type" : "button",
            "listItemClass" : "list-item-edit-button",
            "dom":function () {

                var dom = $('<dl class="window-button round edit-button symbol-button"></dl>');
                this.editButton = $('<dt>').html('&#9998;');
                this.editButtonText = $('<dd>').text(VDRest.app.translate('Edit Timer'));

                return dom.append(this.editButton)
                    .append(this.editButtonText);
            }
        }
    }
};

/**
 * retrieve web tab configuration
 * @returns {{imdb: {dom: "dom", callback: "callback"}}}
 */
Gui.Window.View.Broadcast.prototype.getWebConfig = function () {

    return {
        "imdb":{
            "dom":function () {

                var dom = $('<dl class="window-button web-button imdb"></dl>'),
                    button = $('<dt><img src="'+VDRest.image.getImdbLogo()+'" alt=""></dt>'),
                    text = $('<dd>');

                text.text(VDRest.app.translate('Search IMDB'));

                return dom.append(button).append(text);
            },
            "callback":function () {

                window.open("http://www.imdb.com/find?s=tt&q="+encodeURIComponent(this.getTitle()));
            }
        }
    };
};
/**
 * render contents of tool tab
 * return {jQuery}
 */
Gui.Window.View.Broadcast.prototype.renderToolsTab = function () {

    var i, dom, button, config = this.getToolsConfig();

    dom = $('<ul class="button-list">');

    for (i in config) {

        if (config.hasOwnProperty(i)) {

            button = this.getToolButton(config[i]);
            dom.append(button);

            if (config[i].listItemClass) {

                button.addClass(config[i].listItemClass);
            }
        }
    }

    return dom;
};

/**
 * render contents of web tab
 * @returns {jQuery}
 */
Gui.Window.View.Broadcast.prototype.renderWebTab = function () {

    var i, dom, button, config = this.getWebConfig();

    dom = $('<ul class="button-list">');

    for (i in config) {

        if (config.hasOwnProperty(i)) {

            button = this.getToolButton(config[i]);
            dom.append(button);
        }
    }

    return dom;
};

/**
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.addTitle = function () {

    this.title = $('<h2 class="window-title left">')
        .text(this.getTitle())
        .appendTo(this.header);

    return this;
};

/**
 * add epg image to header
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.addMainImage = function () {

    this.image = $('<img class="window-header-image right" src="' + this.getImages()[0] + '">')
        .appendTo(this.header);

    return this;
};

/**
 * animate epg image on click
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.animateImage = function () {

    this.node.toggleClass('image-expanded');

    if (this.imageIsExpanded) {

        this.image.toggleClass('expand contract');
        this.imageIsExpanded = false;
    } else {

        this.image.removeClass('contract').addClass('expand');
        this.imageIsExpanded = true;
    }

    return this;
};

/**
 * add details list to header
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.addDetails = function () {

    this.details = $('<ul class="window-header-details">');

    if (this.hasShortText()) {

        $('<li class="italic">')
            .text(this.getShortText())
            .appendTo(this.details);
    }


    if (this.hasContents()) {

        this.details.append('<li>'+this.getContents().join(' | ')+'</li>');
    }

    this.details.append(
            '<li>'+this.getChannelName()+'&nbsp;&shy;'
            +this.getStartTime()
            +'&nbsp;-&nbsp'
            +this.getEndTime()+'</li>'
        )
        .appendTo(this.header);

    return this;
};

/**
 * add components
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.addComponents = function () {

    this.header
        .append(
            '<ul class="window-header-components clearer right"><li class="left">'
            +this.getComponents().join('</li><li class="left">')
            +'</li></ul>'
        );

    return this;
};

/**
 * handle timer exists
 * @param {bool} exists
 */
Gui.Window.View.Broadcast.prototype.handleTimerExists = function (exists) {

    if (exists) {

        this.node.addClass('timer-exists');
        this.recordButton.html('&#10006;');
        this.recordButtonText.text(VDRest.app.translate('Delete Timer'));
    } else {

        this.node.removeClass('timer-exists');
        this.recordButton.html('');
        this.recordButtonText.text(VDRest.app.translate('Add Timer'));
    }
};

/**
 * handle timer active
 * @param {bool} active
 */
Gui.Window.View.Broadcast.prototype.handleTimerActive = function (active) {

    if (active) {

        this.node.addClass('timer-active');
    } else {

        this.node.removeClass('timer-active');
    }
};
