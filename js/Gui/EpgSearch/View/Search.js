/**
 * @class
 * @constructor
 */
Gui.EpgSearch.View.Search = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.EpgSearch.View.Search.prototype = new VDRest.Abstract.View();

/**
 * render
 */
Gui.EpgSearch.View.Search.prototype.init = function () {

    this.node = $('<div class="epg-search-view">');
};

/**
 * render
 */
Gui.EpgSearch.View.Search.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    this.addFields();

    this.node.addClass('viewport-fullsize collapsed');

    this.node.toggleClass('collapsed expand');
};

/**
 * render
 */
Gui.EpgSearch.View.Search.prototype.addFields = function () {


//    "query" : options.query,
//        "mode" : options.mode || 0,
//        "channelid" : options.channelid || null,
//        "use_title" : options.use_title || true,
//        "use_subtitle" : options.use_subtitle || false,
//        "use_description" : options.use_description || false




    $.event.trigger({
        "type" : "form.request",
        "config" : {
            "parentView" : this,
            "cacheKey" : 'search',
            "search" : 'Search',
            "catConfig" : {
                "search" : {
                    "label" : VDRest.app.translate("Search")
                }
            },
            "fields" : {
                "query" : {
                    "type" : "string",
                    "category" : "search",
                    "label" : VDRest.app.translate("Query")
                },
                "advanced" : {
                    "type" : "boolean",
                    "category" : "search",
                    "label" : VDRest.app.translate("Advanced"),
                    "checked" : false
                },
                "channel" : {
                    "type" : "channel",
                    "category" : "search",
                    "depends" : "advanced",
                    "label" : "Channel"
                },
                "mode" : {
                    "type" : "enum",
                    "name" : "mode",
                    "label" : VDRest.app.translate("Mode"),
                    "depends" : "advanced",
                    "category" : "search",
                    "values" : {
                        "phrase" : {
                            "label" : VDRest.app.translate("Phrase"),
                            "value" : "0",
                            "selected" : true
                        },
                        "and" : {
                            "label" : VDRest.app.translate("AND"),
                            "value" : "1"
                        },
                        "or" : {
                            "label" : VDRest.app.translate("OR"),
                            "value" : "2"
                        },
                        "regex" : {
                            "label" : VDRest.app.translate("RegEx"),
                            "value" : "3"
                        }
                    }
                },
                "use_title" : {
                    "type" : "boolean",
                    "label" : VDRest.app.translate("Search Title"),
                    "depends" : "advanced",
                    "category" : "search",
                    "checked" : true
                },
                "use_subtitle" : {
                    "type" : "boolean",
                    "label" : VDRest.app.translate("Search Subtitle"),
                    "depends" : "advanced",
                    "category" : "search",
                    "checked" : false
                },
                "use_description" : {
                    "type" : "boolean",
                    "label" : VDRest.app.translate("Search Description"),
                    "depends" : "advanced",
                    "category" : "search",
                    "checked" : false
                }
            },
            "hasSubmit" : true,
            "changed" : $.proxy(function (fields) {

                var query = fields.query.getValue();

                if ('' !== query) {
                    VDRest.app.getModule('VDRest.Epg').getModel('Search').send({
                        "query" : query,
                        "mode" : fields.mode.getValue().value,
                        "channelid" : fields.channel.getValue().value,
                        "use_title" : fields.use_title.getValue(),
                        "use_subtitle" : fields.use_subtitle.getValue(),
                        "use_description" : fields.use_description.getValue()
                    });
                }

            }, this)
        }
    });

};