/**
 * @class
 * @constructor
 */
Gui.Window.View.TimerEdit = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.TimerEdit.prototype = new Gui.Window.View.Abstract();

/**
 * @type {string}
 */
Gui.Window.View.TimerEdit.prototype.cacheKey = 'id';

/**
 * @type {boolean}
 */
Gui.Window.View.TimerEdit.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.TimerEdit.prototype.isModalTransparent = true;

/**
 * @type {boolean}
 */
Gui.Window.View.TimerEdit.prototype.hasHeader = true;

/**
 * @type {boolean}
 */
Gui.Window.View.TimerEdit.prototype.hasBroadcast = false;

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.TimerEdit.prototype.init = function () {

    Gui.Window.View.Abstract.prototype.init.call(this);
};

/**
 * render
 */
Gui.Window.View.TimerEdit.prototype.render = function () {

    this.addClasses().decorateHeader().decorateBody();

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * add classes to window
 * @returns {Gui.Window.View.TimerEdit}
 */
Gui.Window.View.TimerEdit.prototype.addClasses = function () {


    return this;
};

/**
 * set view has a broadcast object
 * @returns {Gui.Window.View.TimerEdit}
 */
Gui.Window.View.TimerEdit.prototype.setHasBroadcast = function () {

    this.hasBroadcast = true;

    return this;
};

/**
 * decorate header with title subtitle and image if available
 * @returns {Gui.Window.View.TimerEdit}
 */
Gui.Window.View.TimerEdit.prototype.decorateHeader = function () {

    this.details = $('<ul class="window-header-details">');

    this.addTitle().addDetails().addMainImage();

    this.details
        .appendTo(this.header);

    this.addFilename();

    return this;
};

/**
 * decorate body with tabs
 * @returns {Gui.Window.View.TimerEdit}
 */
Gui.Window.View.TimerEdit.prototype.decorateBody = function () {


    return this;
};

/**
 * add Title
 * @returns {Gui.Window.View.TimerEdit}
 */
Gui.Window.View.TimerEdit.prototype.addTitle = function () {

    var title;

    if (this.hasBroadcast && this.getBroadcastTitle()) {

        title = this.getBroadcastTitle();

    } else {

        title = this.getFilename();
    }

    this.title = $('<h2 class="window-title left">')
        .text(title)
        .appendTo(this.header);

    return this;
};


/**
 * add details list to header
 * @returns {Gui.Window.View.TimerEdit}
 */
Gui.Window.View.TimerEdit.prototype.addDetails = function () {

    if (this.hasBroadcast && this.hasBroadcastShortText()) {

        $('<li class="italic">')
            .text(this.getBroadcastShortText())
            .appendTo(this.details);
    }


    if (this.hasBroadcast && this.hasBroadcastContents()) {

        this.details.append('<li>'+this.getBroadcastContents().join(' | ')+'</li>');
    }

    this.details.append(
        '<li>'+this.getDate()+'</li>'
    );

    this.details.append(
        '<li>' + this.getChannelName() + ' &nbsp;&shy;'
        + this.getStartTime()
        + '&nbsp;-&nbsp'
        + this.getEndTime()+'</li>'
    );

    return this;
};

/**
 * add epg image to header
 * @returns {Gui.Window.View.TimerEdit}
 */
Gui.Window.View.TimerEdit.prototype.addMainImage = function () {

    if (this.hasBroadcast && this.hasBroadcastImages()) {

        this.image = $('<img class="window-header-image right" src="' + this.getBroadcastImages()[0] + '">')
            .appendTo(this.header);
    }

    return this;
};

/**
 * add filename to header
 * @returns {Gui.Window.View.TimerEdit}
 */
Gui.Window.View.TimerEdit.prototype.addFilename = function () {

    $('<div class="additional-info">')
        .text('File: ' + this.getFilename())
        .appendTo(this.header);

    return this;
};

/**
 * animate epg image on click
 * @returns {Gui.Window.View.TimerEdit}
 */
Gui.Window.View.TimerEdit.prototype.animateImage = function () {

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
 * retrieve tabs configuration
 * @type {Object}
 */
Gui.Window.View.TimerEdit.prototype.getTabConfig = function () {

    this.body.addClass('has-tabs');

    var me = this, tabs = {};

    if (this.hasBroadcast && this.hasBroadcastDescription()) {

        tabs.details = {
            "label": "Details",
            "content": function (content) {

                $(content).append(me.getBroadcastDescription());
            },
            "default": true
        };

    }

    tabs.tools = {
        "label": "Tools",
        "content": function (content) {

            $(content).append(me.renderToolsTab());
        }
    };

    if (this.hasBroadcast && this.hasBroadcastDescription()) {
        tabs.web = {
            "label": "Web",
            "content": function (content) {

                $(content).append(me.renderWebTab());
            }
        };
    }

    if (!(this.hasBroadcast && this.hasBroadcastDescription())) {

        tabs.tools.default = true;
    }

    return {
        "keyInCache": this.keyInCache,
        "parentView" : this.body,
        "cacheKey" : this.cacheKey,
        "tabs" : tabs
    }
};

/**
 * retrieve tools tab configuration
 * @returns {object}
 */
Gui.Window.View.TimerEdit.prototype.getToolsConfig = function () {

    var button, text, me = this;

    return {
        "delete":{
            "dom":function () {

                me.deleteButton = $('<dl class="delete-button"></dl>');
                button = $('<dt>').html('&#10006;');
                text = $('<dd>').text('Delete Timer');

                return me.deleteButton.append(button).append(text);
            }
        }
    }
};

/**
 * retrieve web tab configuration
 * @returns {object}
 */
Gui.Window.View.TimerEdit.prototype.getWebConfig = function () {

    return {
        "imdb":{
            "dom":function () {

                var dom = $('<dl class="web-button imdb"></dl>'),
                    button = $('<dt><img src="/assets/imdb-logo.png" alt="">'),
                    text = $('<dd>');

                text.text('Search IMDB');

                return dom.append(button).append(text);
            },
            "callback":function () {

                window.open("http://www.imdb.com/find?s=tt&q="+encodeURIComponent(this.getBroadcastTitle()));
            }
        }
    };
};
/**
 * render contents of tool tab
 * return {jQuery}
 */
Gui.Window.View.TimerEdit.prototype.renderToolsTab = function () {

    var i, dom, button, config = this.getToolsConfig();

    dom = $('<ul>');

    for (i in config) {

        if (config.hasOwnProperty(i)) {

            button = this.getToolButton(config[i]);
            dom.append(button);
        }
    }

    return dom;
};

/**
 * render contents of web tab
 * @returns {jQuery}
 */
Gui.Window.View.TimerEdit.prototype.renderWebTab = function () {

    var i, dom, button, config = this.getWebConfig();

    dom = $('<ul>');

    for (i in config) {

        if (config.hasOwnProperty(i)) {

            button = this.getToolButton(config[i]);
            dom.append(button);
        }
    }

    return dom;
};