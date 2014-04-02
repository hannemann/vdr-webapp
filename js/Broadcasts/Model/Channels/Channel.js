Broadcasts.Model.Channels.Channel = function () {};

Broadcasts.Model.Channels.Channel.prototype = new Abstract.Model();

Broadcasts.Model.Channels.Channel.prototype.identifier = 'number';

Broadcasts.Model.Channels.Channel.prototype.init = function () {

    var baseUrl = this.module.getResource().getBaseUrl();

    if (this.getData('image')) {

        this.setData('image', baseUrl + 'channels/image/' + this.getData('channel_id'));
    }

};

Broadcasts.Model.Channels.Channel.prototype.setIdentifier = function (raw) {

    raw.id = raw[this.identifier];
};