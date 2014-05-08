
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
 * render contents of tool tab
 * return {jQuery}
 */
Gui.Window.View.Recording.prototype.renderToolsTab = function () {

    return Gui.Window.View.Broadcast.prototype.renderToolsTab.apply(this);
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
Gui.Window.View.Recording.prototype.getToolsConfig = function () {

    var deleteButton, deleteText, me = this;

    return {
        "delete":{
            "dom":function () {

                var dom = $('<dl class="window-button round delete-button symbol-button"></dl>');
                deleteButton = $('<dt>').html('&#10006;');
                deleteText = $('<dd>');

                deleteText.text(VDRest.app.translate('Delete Recording'));
                deleteButton.removeClass('activate-timer');

                return dom.append(deleteButton).append(deleteText);
            },
            "callback":function () {

                var controller = me.module.getController('Recording', me.keyInCache);
                VDRest.Api.actions.deleteRecording(me, $.proxy(controller.deleteAction, controller));
            }
        }
    }
};