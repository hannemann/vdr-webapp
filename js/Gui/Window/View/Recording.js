
Gui.Window.View.Recording = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Recording.prototype = new Gui.Window.View.Abstract();

Gui.Window.View.Recording.prototype.cacheKey = 'number';

Gui.Window.View.Recording.prototype.isModal = true;

Gui.Window.View.Recording.prototype.hasHeader = true;

Gui.Window.View.Recording.prototype.hasCloseButton = true;

Gui.Window.View.Recording.prototype.render = function () {

    console.log(this);

    this.addClasses().decorateHeader().decorateBody();

    Gui.Window.View.Abstract.prototype.render.call(this);
};

Gui.Window.View.Recording.prototype.addClasses = function () {

    this.node.addClass('window-recording clearer');

    return this;
};

Gui.Window.View.Recording.prototype.decorateHeader = function () {

    this.addTitle();

    return this;
};

Gui.Window.View.Recording.prototype.addTitle = function () {

    this.title = $('<h2 class="window-title left">')
        .text(this.getEventTitle())
        .appendTo(this.header);

    this.details = $('<ul class="window-header-details">')
        .appendTo(this.header);

    if (this.hasEventShortText()) {

        $('<li class="italic">')
            .text(this.getEventShortText())
            .appendTo(this.details);
    }

    return this;
};

Gui.Window.View.Recording.prototype.decorateBody = function () {



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

Gui.Window.View.Recording.prototype.getWebConfig = function () {

    var webConfig = Gui.Window.View.Broadcast.prototype.getWebConfig.apply(this);

    webConfig.imdb.callback = function () {

        window.open("http://www.imdb.com/find?s=tt&q="+encodeURIComponent(this.getEventTitle()));
    };

    return webConfig;
};
/**
 * render contents of tool tab
 * return {jQuery}
 */
Gui.Window.View.Recording.prototype.renderWebTab = function () {

    return Gui.Window.View.Broadcast.prototype.renderWebTab.apply(this);
};

Gui.Window.View.Recording.prototype.getToolsConfig = function () {

    var deleteButton, deleteText, me = this;

    return {
        "delete":{
            "dom":function () {

                var dom = $('<dl class="delete-button"></dl>');
                deleteButton = $('<dt>').html('&#10006;');
                deleteText = $('<dd>');

                deleteText.text('Delete Recording');
                deleteButton.removeClass('activate-timer');

                return dom.append(deleteButton).append(deleteText);
            },
            "callback":function () {

              VDRest.Rest.actions.deleteRecording(me, $.proxy(me.handleDelete, me));
            }
        }
    }
};

Gui.Window.View.Recording.prototype.handleDelete = function () {

    var model = VDRest.app.getModule('VDRest.Recordings').getModel(
            'List.Recording',
            this.keyInCache
        ),
        view = VDRest.app.getModule('Gui.Recordings').getView('List.Recording', this.keyInCache);

    VDRest.app.getModule('VDRest.Recordings').cache.invalidateAllTypes(model);

    VDRest.app.getModule('Gui.Recordings').cache.invalidateAllTypes(view);

    view.destruct();

    this.destruct();
};