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
                    "label" : "Search"
                }
            },
            "fields" : {
                "query" : {
                    "type" : "string",
                    "category" : "search",
                    "label" : "Query",
                    "getValue" : function () {
                        return '';
                    }
                },
                "advanced" : {
                    "type" : "boolean",
                    "category" : "search",
                    "label" : "Advanced",
                    "getValue" : function () {
                        return false;
                    }
                },
                "mode" : {
                    "type" : "enum",
                    "name" : "mode",
                    "label" : "Mode",
                    "depends" : "advanced",
                    "category" : "search",
                    "values" : {
                        "phrase" : {
                            "label" : "Phrase",
                            "value" : "0"
                        },
                        "and" : {
                            "label" : "AND",
                            "value" : "1"
                        },
                        "or" : {
                            "label" : "OR",
                            "value" : "2"
                        },
                        "regex" : {
                            "label" : "RegEx",
                            "value" : "3"
                        }
                    },
                    "getValue" : function () {

                        return "phrase";
                    }
                },
                "use_title" : {
                    "type" : "boolean",
                    "label" : "Use Title",
                    "depends" : "advanced",
                    "category" : "search",
                    "getValue" : function () {
                        return true;
                    }
                },
                "use_subtitle" : {
                    "type" : "boolean",
                    "label" : "Use Subtitle",
                    "depends" : "advanced",
                    "category" : "search",
                    "getValue" : function () {
                        return false;
                    }
                },
                "use_description" : {
                    "type" : "boolean",
                    "label" : "Use Description",
                    "depends" : "advanced",
                    "category" : "search",
                    "getValue" : function () {
                        return false;
                    }
                }
            },
            "hasSubmit" : true,
            "changed" : $.proxy(function (e) {

                VDRest.app.getModule('VDRest.Epg').getModel('Search').send({
                    "query" : e.payload.value
                });

            }, this)
        }
    });

};