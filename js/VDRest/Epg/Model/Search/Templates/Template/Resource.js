VDRest.Epg.Model.Search.Templates.Template.Resource = function () {};

VDRest.Epg.Model.Search.Templates.Template.Resource.prototype = new VDRest.Lib.LocalStorage();

VDRest.Epg.Model.Search.Templates.Template.Resource.prototype.storageName = 'EpgSearch.Templates';

VDRest.Epg.Model.Search.Templates.Template.Resource.prototype.collection = null;

VDRest.Epg.Model.Search.Templates.Template.Resource.prototype.getCollection = function () {

    if (!this.collection) {
        this.load();
    }

    return this.collection;
};

VDRest.Epg.Model.Search.Templates.Template.Resource.prototype.load = function () {

    var collection;
    try {

        collection = JSON.parse(this.getItem(this.storageName));

        this.collection = collection || {};
    } catch (e) {
        this.onError(e);
        this.collection = {};
    }
};

VDRest.Epg.Model.Search.Templates.Template.Resource.prototype.save = function (templates) {

    this.setItem(this.storageName, JSON.stringify(templates));

    return this;
};

/**
 * @param {Error} e
 * @param {string} [message]
 */
VDRest.Epg.Model.Search.Templates.Template.Resource.prototype.onError = function (e, message) {

    message = message || e.message;

    VDRest.helper.log(message);
    VDRest.helper.log(e.stack);

    $.event.trigger({
        "type": "window.request",
        "payload": {
            "type": "Alert",
            "data": {
                "message": VDRest.app.translate(message)
            }
        }
    });
};
