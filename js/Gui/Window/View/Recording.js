/**
 * @class
 * @constructor
 */
Gui.Window.View.Recording = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Recording.prototype = new Gui.Window.View.Abstract();

/**
 * @type {string}
 */
Gui.Window.View.Recording.prototype.cacheKey = 'id';

/**
 * @type {string}
 */
Gui.Window.View.Recording.prototype.scraperImageUrl =
    '//' + VDRest.config.getItem('host') + ':' + VDRest.config.getItem('port') + '/scraper/image/';

/**
 * @type {boolean}
 */
Gui.Window.View.Recording.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Recording.prototype.isModalTransparent = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Recording.prototype.hasHeader = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Recording.prototype.hasDesktopCloseButton = true;

/**
 * render
 */
Gui.Window.View.Recording.prototype.render = function () {

    this.addClasses().decorateHeader();

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * add class names
 * @returns {Gui.Window.View.Recording}
 */
Gui.Window.View.Recording.prototype.addClasses = function () {

    this.node.addClass('window-recording clearer');

    return this;
};

/**
 * add title and details
 * @returns {Gui.Window.View.Recording}
 */
Gui.Window.View.Recording.prototype.decorateHeader = function () {

    this.headerContentWrapper = $('<div class="wrapper left">').appendTo(this.header);
    this.addTitle().addDetails().addFanart();

    return this;
};

/**
 * add Title
 * @returns {Gui.Window.View.Recording}
 */
Gui.Window.View.Recording.prototype.addTitle = function () {

    this.title = $('<h2 class="window-title left">')
        .text(this.getEventTitle())
        .appendTo(this.headerContentWrapper);

    return this;
};

/**
 * add details
 * @returns {Gui.Window.View.Recording}
 */
Gui.Window.View.Recording.prototype.addDetails = function () {

    this.details = $('<ul class="window-header-details">')
        .appendTo(this.headerContentWrapper);

    if (this.hasEventShortText()) {

        $('<li class="italic">')
            .text(this.getEventShortText())
            .appendTo(this.details);
    }

    $('<li>')
        .text(this.getStartDate())
        .appendTo(this.details);

    $('<li>')
        .text(this.getDurationString())
        .appendTo(this.details);

    return this;
};

/**
 * add fanart if available
 */
Gui.Window.View.Recording.prototype.addFanart = function () {

    var fanartUrl, media = this.getAdditionalMedia();

    if (media) {

        if (media.series_id) {

            if (media.fanarts && media.fanarts[0] && media.fanarts[0].path)

            fanartUrl = this.scraperImageUrl + media.fanarts[0].path;

        } else if (media.fanart) {

            fanartUrl = this.scraperImageUrl + media.fanart;
        }
        if (fanartUrl) {

            $('<img>').addClass('fanart').attr('src', fanartUrl).appendTo(this.header);

            this.header.addClass('has-fanart');
        }
    }
};

/**
 * @type {Object}
 */
Gui.Window.View.Recording.prototype.getTabConfig = function () {

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

                    $(content).append(me.getEventDescription());
                },
                "default": true
            },
            "edit": {
                "label": "Edit",
                "content": function (content) {

                    $(content).append(me.renderEditTab());
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
 * render contents of tool tab
 * return {jQuery}
 */
Gui.Window.View.Recording.prototype.renderEditTab = function () {

    var i, dom, buttonList, button, config = this.getEditConfig();

    dom = $('<div>');

    buttonList = $('<ul class="button-list clearer">');

    for (i in config) {

        if (config.hasOwnProperty(i)) {

            if ("button" === config[i].type) {
                button = this.getToolButton(config[i]);
                buttonList.append(button);
            }
        }
    }

    dom.append(buttonList);

    $.event.trigger({
        "type" : "form.request",
        "config" : {
            "parentView" : {
                "node" : dom
            },
            "owner" : this,
            "reference" : "editForm",
            "cacheKey" : this.cacheKey,
            "keyInCache" : this.keyInCache,
            "id": this.keyInCache,
            "catConfig" : config.editForm.categories,
            "fields" : config.editForm.fields,
            "hasSubmit" : true,
            "changed" : $.proxy(function () {

                $.event.trigger({
                    "type" : "persistrecordingschange-" + this.keyInCache,
                    "payload" : config.editForm.fields
                });
            }, this)
        }
    });

    return dom;
};

/**
 * get web tab configuration
 * @returns {*|{imdb: {dom: string, callback: string}}}
 */
Gui.Window.View.Recording.prototype.getWebConfig = function () {

    var webConfig = Gui.Window.View.Broadcast.prototype.getWebConfig.apply(this);

    webConfig.imdb.callback = function () {

        window.open("http://www.imdb.com/find?s=tt&q="+encodeURIComponent(this.getEventTitle()));
    };

    return webConfig;
};
/**
 * render contents of web tab
 * return {jQuery}
 */
Gui.Window.View.Recording.prototype.renderWebTab = function () {

    return Gui.Window.View.Broadcast.prototype.renderWebTab.apply(this);
};

/**
 * retrieve tool tab configuration
 * @returns {object}
 */
Gui.Window.View.Recording.prototype.getEditConfig = function () {

    var me = this, editConfig = {};


    editConfig.delete = {
        "type" : "button",
        "dom":function () {

            var dom = $('<dl class="window-button round delete-button symbol-button"></dl>');
            this.deleteButton = $('<dt>').html('&#10006;');

            return dom.append(this.deleteButton)
                .append($('<dd>').text(VDRest.app.translate('Delete Recording')));
        }
    };
    if (VDRest.info.getStreamer()) {
        editConfig.watch = {
            "type": "button",
            "dom": function () {

                var dom = $('<dl class="window-button round watch-button symbol-button vdr-web-symbol"></dl>');
                this.watchButton = $('<dt>').html('C');

                return dom.append(this.watchButton)
                    .append($('<dd>').text(VDRest.app.translate('Watch Recording')));
            }
        };
    }
    editConfig.editForm = {
        "categories" : {
            "file" : {
                "label" : VDRest.app.translate("File")
            }
        },
        "fields" : {
            "filename" : {
                "type" : "string",
                "category" : "file",
                "label" : VDRest.app.translate("Filename"),
                "value" : this.getNormalizedFileName()
            },
            "dirname" : {
                "type" : "directory",
                "category" : "file",
                "label" : VDRest.app.translate("Folder"),
                "value" : this.getPath()
            }
        }
    };
    editConfig.subToFilename = {
        "type" : "button",
        "dom":function () {

            me.subToFilenameButton = $('<dl class="window-button round symbol-button generate-button"></dl>');
            button = $('<dt>').html('&#9734;');
            text = $('<dd>').text(VDRest.app.translate('Subtitle to Filename'));

            return me.subToFilenameButton.append(button).append(text);
        }
    };
    return editConfig;
};

/**
 * generate filename from title and subtitle of broadcast
 */
Gui.Window.View.Recording.prototype.subToFilename = function () {

    VDRest.Abstract.Controller.prototype.vibrate();

    this.editForm.filename.gui.val(this.getEventTitle() + '~' + this.getEventShortText());

    this.editForm.filename.gui.change();
};
