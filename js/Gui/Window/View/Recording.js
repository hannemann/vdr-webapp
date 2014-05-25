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
Gui.Window.View.Recording.prototype.cacheKey = 'number';

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

    this.addTitle().addDetails();

    return this;
};

/**
 * add Title
 * @returns {Gui.Window.View.Recording}
 */
Gui.Window.View.Recording.prototype.addTitle = function () {

    this.title = $('<h2 class="window-title left">')
        .text(this.getEventTitle())
        .appendTo(this.header);

    return this;
};

/**
 * add details
 * @returns {Gui.Window.View.Recording}
 */
Gui.Window.View.Recording.prototype.addDetails = function () {

    this.details = $('<ul class="window-header-details">')
        .appendTo(this.header);

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
            "number" : this.keyInCache,
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

    var me = this;

    return {
        "delete":{
            "type" : "button",
            "dom":function () {

                var dom = $('<dl class="window-button round delete-button symbol-button"></dl>');
                this.deleteButton = $('<dt>').html('&#10006;');

                return dom.append(this.deleteButton)
                    .append($('<dd>').text(VDRest.app.translate('Delete Recording')));
            }
        },
        "watch": {
            "dom": function () {

                var dom = $('<dl class="window-button round watch-button symbol-button"></dl>');
                this.watchButton = $('<dt>').html('&#10006;');

                return dom.append(this.watchButton)
                    .append($('<dd>').text(VDRest.app.translate('Watch Recording')));
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
                    "value" : this.getNormalizedFileName()
                },
                "dirname" : {
                    "type" : "directory",
                    "category" : "file",
                    "label" : VDRest.app.translate("Folder"),
                    "value" : this.getPath()
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
 * generate filename from title and subtitle of broadcast
 */
Gui.Window.View.Recording.prototype.subToFilename = function () {

    this.editForm.filename.gui.val(this.getEventTitle() + '~' + this.getEventShortText());

    this.editForm.filename.gui.change();
};
