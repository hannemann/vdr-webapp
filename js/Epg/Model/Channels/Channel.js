Epg.Model.Channels.Channel = function () {};

Epg.Model.Channels.Channel.prototype = new Abstract.Model();

Epg.Model.Channels.Channel.prototype.identifier = 'number';

Epg.Model.Channels.Channel.prototype.init = function () {

    var baseUrl = this.module.getResource().getBaseUrl();

    if (this.getData('image')) {

        this.setData('image', baseUrl + 'channels/image/' + this.getData('channel_id'));
    }

};

Epg.Model.Channels.Channel.prototype.setIdentifier = function (raw) {

    raw.id = raw[this.identifier];
};