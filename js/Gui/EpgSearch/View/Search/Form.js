/**
 * @class
 * @constructor
 */
Gui.EpgSearch.View.Search.Form = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.EpgSearch.View.Search.Form.prototype = new VDRest.Abstract.View();

/**
 * render
 */
Gui.EpgSearch.View.Search.Form.prototype.init = function () {

    this.node = $('<div class="epg-search-form">');
    this.buttonContainer = $('<div class="epg-search-buttons clearer">');
};

/**
 * render
 */
Gui.EpgSearch.View.Search.Form.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    this.requestForm();
};

Gui.EpgSearch.View.Search.Form.prototype.getSearchFormFields = function () {

    var i;

    this.searchFormFields = this.getSearchFormData().fields;


    for (i in this.searchFormFields) {

        if (this.searchFormFields.hasOwnProperty(i)) {

            this.searchFormFields[i].category = 'search';
        }
    }

    return this.searchFormFields;
};

/**
 * request form
 */
Gui.EpgSearch.View.Search.Form.prototype.requestForm = function () {

    $.event.trigger({
        "type" : "form.request",
        "config" : {
            "parentView" : this,
            "cacheKey" : 'search',
            "search" : 'Search',
            "noWindow" : true,
            "catConfig" : {
                "search" : {
                    "label" : VDRest.app.translate("Search")
                }
            },
            "fields" : this.getSearchFormFields(),
            "buttonContainer" : this.buttonContainer,
            "submitLabel" : "j",
            "onrender" : function () {
                this.buttonContainer.children('.button-cancel').remove();
                this.buttonContainer.children('.button-confirm').addClass('vdr-web-symbol');
                this.buttonContainer.appendTo(this.node);
            }.bind(this),
            "onsubmit": function (fields) {

                var model;

                if ('' !== fields.search.getValue()) {

                    model = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer', {"id" : -1});

                    VDRest.app.getModule('VDRest.Epg').getModel('Search').send(
                        model.copyFromForm(fields)
                    );
                }

            }.bind(this)
        }
    });

};

/**
 * retrieve channelgroups
 * @return {Gui.EpgSearch.Controller.Search.channelgroups}
 */
Gui.EpgSearch.View.Search.Form.prototype.getChannelGroupFieldValues = function () {

    /**
     * @type {Gui.EpgSearch.Controller.Search.channelgroups}
     */
    var cGroups = this.module.getController('Search.Form').channelgroups, i;

    for (i in cGroups) {
        if (cGroups.hasOwnProperty(i)) {
            cGroups[i].value = i;
            cGroups[i].selected = false;
            cGroups[i].translate = false;
        }
    }

    return cGroups;
};