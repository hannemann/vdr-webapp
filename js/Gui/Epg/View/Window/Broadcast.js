/**
 * @class
 * @constructor
 * @method {boolean} hasImages
 * @method {Array} getImages
 */
Gui.Epg.View.Window.Broadcast = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Epg.View.Window.Broadcast.prototype = new Gui.Window.View.ScrollAnimateHeader();

/**
 * cache key
 * @type {string}
 */
Gui.Epg.View.Window.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * @type {string}
 */
Gui.Epg.View.Window.Broadcast.prototype.hasHeader = true;

/**
 * @type {boolean}
 */
Gui.Epg.View.Window.Broadcast.prototype.isModal = false;

/**
 * @type {boolean}
 */
Gui.Epg.View.Window.Broadcast.prototype.isModalTransparent = true;

/**
 * add components, call render method
 */
Gui.Epg.View.Window.Broadcast.prototype.render = function () {

    this.node.addClass('collapsed document-fullsize');

    this.fanart = this.getEpisodeImage(window.innerWidth) || this.getFanart(window.innerWidth);

    Gui.Window.View.ScrollAnimateHeader.prototype.render.call(this);

    this.addTitle();

    this.addMainImage();

    this.addDetails();

    if (this.hasComponents()) {

        this.addComponents()
    }

    this.addClasses();

    this.node.toggleClass('collapsed expand');

    if (this.canAnimateScroll()) {
        this.node.addClass('touchscroll');
    }
};

/**
 * add class names
 * @returns {Gui.Epg.View.Window.Broadcast}
 */
Gui.Epg.View.Window.Broadcast.prototype.addClasses = function () {

    var classNames = ['broadcast', 'scroll-animate-header'];

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
Gui.Epg.View.Window.Broadcast.prototype.getTabConfig = function () {

    this.body.addClass('has-tabs');

    var me = this;

    return {
        "channel": this.data.channel,
        "id": this.data.id,
        "parentView" : this.body,
        "cacheKey" : this.cacheKey,
        "tabs" : {
            "details": {
                "label": "Details",
                "content": function (content) {

                    $(content).append(me.getDescription());
                    me.detailsTab = content;
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
Gui.Epg.View.Window.Broadcast.prototype.getToolsConfig = function () {

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
Gui.Epg.View.Window.Broadcast.prototype.getWebConfig = function () {

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
Gui.Epg.View.Window.Broadcast.prototype.renderToolsTab = function () {

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
Gui.Epg.View.Window.Broadcast.prototype.renderWebTab = function () {

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
 * @returns {Gui.Epg.View.Window.Broadcast}
 */
Gui.Epg.View.Window.Broadcast.prototype.addTitle = function () {

    this.title = $('<h2 class="window-title">')
        .text(this.getTitle())
        .appendTo(this.scrollShiftWrapper);

    return this;
};

/**
 * add epg image to header
 * @returns {Gui.Epg.View.Window.Broadcast}
 */
Gui.Epg.View.Window.Broadcast.prototype.addMainImage = function () {

    var src = this.fanart || this.getEpgImage();

    if (!this.fanart && src) {
        this.image = $('<img class="window-header-image right" src="' + src + '">')
            .appendTo(this.scrollShiftWrapper);
    }

    if (this.fanart) {
        this.scrollShiftWrapper.css({
            "background-image": 'url(' + this.fanart + ')'
        });
        this.header.addClass('has-fanart');
    }

    return this;
};

/**
 * animate epg image on click
 * @returns {Gui.Epg.View.Window.Broadcast}
 */
Gui.Epg.View.Window.Broadcast.prototype.animateImage = function () {

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
 * @returns {Gui.Epg.View.Window.Broadcast}
 */
Gui.Epg.View.Window.Broadcast.prototype.addDetails = function () {

    this.details = $('<ul>');

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
    );

    this.details.addClass('window-' + (this.fanart ? 'body' : 'header') + '-details');
    this.details[(this.fanart ? 'prependTo' : 'appendTo')]((this.fanart ? this.detailsTab : this.scrollShiftWrapper));

    if (this.fanart && this.detailsTab.parent('ul').height() < this.detailsTab.height()) {
        this.detailsTab.parent('ul').height(this.detailsTab.height());
    }

    return this;
};

/**
 * add components
 * @returns {Gui.Epg.View.Window.Broadcast}
 */
Gui.Epg.View.Window.Broadcast.prototype.addComponents = function () {

    this.components = $(
        '<ul class="window-header-components clearer right"><li class="left">'
        + this.getComponents().join('</li><li class="left">')
        + '</li></ul>'
    ).appendTo(this.scrollShiftWrapper);

    if (this.fanart) {
        this.components.addClass('bottom');
    }

    return this;
};

/**
 * handle timer exists
 * @param {bool} exists
 */
Gui.Epg.View.Window.Broadcast.prototype.handleTimerExists = function (exists) {

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
Gui.Epg.View.Window.Broadcast.prototype.handleTimerActive = function (active) {

    if (active) {

        this.node.addClass('timer-active');
    } else {

        this.node.removeClass('timer-active');
    }
};
