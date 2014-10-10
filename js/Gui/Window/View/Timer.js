/**
 * @class
 * @constructor
 */
Gui.Window.View.Timer = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Timer.prototype = new Gui.Window.View.Abstract();

/**
 * @type {string}
 */
Gui.Window.View.Timer.prototype.cacheKey = 'id';

/**
 * @type {boolean}
 */
Gui.Window.View.Timer.prototype.isModal = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Timer.prototype.isModalTransparent = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Timer.prototype.hasHeader = true;

/**
 * @type {boolean}
 */
Gui.Window.View.Timer.prototype.hasBroadcast = false;

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Timer.prototype.init = function () {

    Gui.Window.View.Abstract.prototype.init.call(this);
};

/**
 * render
 */
Gui.Window.View.Timer.prototype.render = function () {

    this.addClasses().decorateHeader().decorateBody();

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * update
 */
Gui.Window.View.Timer.prototype.update = function () {

    this.header.empty();

    this.addClasses().decorateHeader();
};

/**
 * add classes to window
 * @returns {Gui.Window.View.Timer}
 */
Gui.Window.View.Timer.prototype.addClasses = function () {


    return this;
};

/**
 * set view has a broadcast object
 * @returns {Gui.Window.View.Timer}
 */
Gui.Window.View.Timer.prototype.setHasBroadcast = function () {

    this.hasBroadcast = true;

    return this;
};

/**
 * decorate header with title subtitle and image if available
 * @returns {Gui.Window.View.Timer}
 */
Gui.Window.View.Timer.prototype.decorateHeader = function () {

    this.details = $('<ul class="window-header-details">');

    this.addTitle().addDetails().addMainImage();

    this.details
        .appendTo(this.header);

    this.addFilename();

    return this;
};

/**
 * decorate body with tabs
 * @returns {Gui.Window.View.Timer}
 */
Gui.Window.View.Timer.prototype.decorateBody = function () {


    return this;
};

/**
 * add Title
 * @returns {Gui.Window.View.Timer}
 */
Gui.Window.View.Timer.prototype.addTitle = function () {

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
 * @returns {Gui.Window.View.Timer}
 */
Gui.Window.View.Timer.prototype.addDetails = function () {

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
 * @returns {Gui.Window.View.Timer}
 */
Gui.Window.View.Timer.prototype.addMainImage = function () {

    if (this.hasBroadcast && this.hasBroadcastImages()) {

        this.image = $('<img class="window-header-image right" src="' + this.getBroadcastImages()[0] + '">')
            .appendTo(this.header);
    }

    return this;
};

/**
 * add filename to header
 * @returns {Gui.Window.View.Timer}
 */
Gui.Window.View.Timer.prototype.addFilename = function () {

    $('<div class="additional-info">')
        .text(VDRest.app.translate('File') + ': ' + this.getFilename())
        .appendTo(this.header);

    return this;
};

/**
 * animate epg image on click
 * @returns {Gui.Window.View.Timer}
 */
Gui.Window.View.Timer.prototype.animateImage = function () {

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
Gui.Window.View.Timer.prototype.getTabConfig = function () {

    this.body.addClass('has-tabs');

    var me = this, tabs = {}, tabConfig = {};

    if (this.hasBroadcast && this.hasBroadcastDescription()) {

        tabs.details = {
            "label": "Details",
            "content": function (content) {

                $(content).append(me.getBroadcastDescription());
            },
            "default": true
        };

    }

    tabs.edit = {
        "label": "Edit",
        "content": function (content) {

            $(content).append(me.renderEditTab());
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

        tabs.edit.default = true;
    }

    tabConfig["keyInCache"] = this.keyInCache;
    tabConfig["parentView"] = this.body;
    tabConfig["cacheKey"] = this.cacheKey;
    tabConfig["id"] = this.getId();
    tabConfig["tabs"] = tabs;

    return tabConfig;
};

/**
 * retrieve tools tab configuration
 * @returns {object}
 */
Gui.Window.View.Timer.prototype.getEditConfig = function () {

    var button, text, me = this;

    return {
        "delete":{
            "type" : "button",
            "dom":function () {

                me.deleteButton = $('<dl class="window-button round delete-button symbol-button"></dl>');
                button = $('<dt>').html('&#10006;');
                text = $('<dd>').text(VDRest.app.translate('Delete Timer'));

                return me.deleteButton.append(button).append(text);
            }
        },
        "activate":{
            "type" : "button",
            "dom":function () {

                me.activateButton = $('<dl class="window-button round activate-button symbol-button"></dl>');
                button = $('<dt>').html('&#10003;');
                text = $('<dd>').text(VDRest.app.translate('Activate Timer'));

                return me.activateButton.append(button).append(text);
            }
        },
        "editForm" : {
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
                    "value" : this.getFilename()
                },
                "dirname" : {
                    "type" : "directory",
                    "category" : "file",
                    "label" : VDRest.app.translate("Folder"),
                    "value" : this.getDirName()
                }
            }
        },
        "subToFilename":{
            "type" : "button",
            "dom":function () {

                me.subToFilenameButton = $('<dl class="window-button round symbol-button generate-button"></dl>');
                button = $('<dt>').html('&#9734;');
                text = $('<dd>').text(VDRest.app.translate('Subtitle to Filename'));

                return me.subToFilenameButton.append(button).append(text);
            }
        }
    }
};

/**
 * retrieve web tab configuration
 * @returns {object}
 */
Gui.Window.View.Timer.prototype.getWebConfig = function () {

    return {
        "imdb":{
            "dom":function () {

                var dom = $('<dl class="window-button web-button imdb"></dl>'),
                    button = $('<dt><img src="' + VDRest.image.getImdbLogo() + '" alt="">'),
                    text = $('<dd>');

                text.text(VDRest.app.translate('Search IMDB'));

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
Gui.Window.View.Timer.prototype.renderEditTab = function () {

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
            "id" : this.getId(),
            "catConfig" : config.editForm.categories,
            "fields" : config.editForm.fields,
            "hasSubmit" : true,
            "changed" : $.proxy(function () {

                $.event.trigger({
                    "type" : "persisttimerchange-" + this.keyInCache,
                    "payload" : config.editForm.fields
                });
            }, this)
        }
    });

    return dom;
};

/**
 * generate filename from title and subtitle of broadcast
 */
Gui.Window.View.Timer.prototype.subToFilename = function () {

    VDRest.Abstract.Controller.prototype.vibrate();

    this.editForm.filename.gui.val(this.getBroadcastTitle() + '~' + this.getBroadcastShortText());

    this.editForm.filename.gui.change();
};

/**
 * render contents of web tab
 * @returns {jQuery}
 */
Gui.Window.View.Timer.prototype.renderWebTab = function () {

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
 * toggle color and text of activate button
 * @param active
 */
Gui.Window.View.Timer.prototype.handleTimerActive = function (active) {

    this.activateButton.toggleClass('is-active', active);

    this.activateButton.find('dd')
        .text(active ? VDRest.app.translate('Deactivate Timer') : VDRest.app.translate('Activate Timer'));
};
